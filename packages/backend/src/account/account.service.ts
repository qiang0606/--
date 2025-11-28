import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  ManagedAccount,
  ManagedAccountDocument,
} from "../entities/managed-account.schema";
import { UserFriend, UserFriendDocument } from "../entities/user-friend.schema";
import { ClientUser, ClientUserDocument } from "../entities/client-user.schema";

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(ManagedAccount.name)
    private managedAccountModel: Model<ManagedAccountDocument>,
    @InjectModel(UserFriend.name)
    private userFriendModel: Model<UserFriendDocument>,
    @InjectModel(ClientUser.name)
    private clientUserModel: Model<ClientUserDocument>
  ) {}

  async getManagedAccounts(ownerId: string): Promise<any[]> {
    const accounts = await this.managedAccountModel
      .find({ ownerId })
      .sort({ createdAt: -1 })
      .exec();
    return accounts.map((acc) => ({
      ...acc.toObject(),
      id: acc._id.toString(),
      ownerId: acc.ownerId.toString(),
    }));
  }

  async getFriends(managedAccountId: string): Promise<any[]> {
    // 查询托管账号下的好友（客户端用户）
    const friends = await this.userFriendModel
      .find({ managedAccountId: new Types.ObjectId(managedAccountId) })
      .populate("clientUserId", "nickname avatar username")
      .sort({ lastMessageTime: -1 })
      .exec();

    return friends.map((f) => {
      const clientUser = f.clientUserId as any;
      return {
        id: f._id.toString(),
        managedAccountId: f.managedAccountId.toString(),
        clientUserId: clientUser?._id?.toString() || clientUser?.id,
        nickname: clientUser?.nickname || "",
        avatar: clientUser?.avatar,
        username: clientUser?.username || "",
        remark: f.remark,
        status: f.status,
        lastMessage: f.lastMessage,
        lastMessageTime: f.lastMessageTime,
        unreadCount: f.unreadCount,
      };
    });
  }

  async createManagedAccount(
    ownerId: string,
    username: string,
    nickname: string,
    avatar?: string
  ): Promise<ManagedAccountDocument> {
    const account = new this.managedAccountModel({
      ownerId,
      username,
      nickname,
      avatar,
    });
    return account.save();
  }

  async createFriend(
    managedAccountId: string,
    clientUserId: string,
    remark?: string
  ): Promise<UserFriendDocument> {
    // 检查是否已经是好友
    const existing = await this.userFriendModel
      .findOne({
        managedAccountId: new Types.ObjectId(managedAccountId),
        clientUserId: new Types.ObjectId(clientUserId),
      })
      .exec();
    if (existing) {
      throw new Error("该用户已经是您的好友，无需重复添加");
    }

    // 检查客户端用户是否存在
    const clientUser = await this.clientUserModel.findById(clientUserId).exec();
    if (!clientUser) {
      throw new Error("要添加的用户不存在，请检查用户ID是否正确");
    }

    try {
      const friend = new this.userFriendModel({
        managedAccountId: new Types.ObjectId(managedAccountId),
        clientUserId: new Types.ObjectId(clientUserId),
        remark,
      });
      return await friend.save();
    } catch (error: any) {
      // 处理 Mongoose 验证错误
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors || {}).map(
          (err: any) => err.message
        );
        throw new Error(`数据验证失败: ${messages.join(", ")}`);
      }
      throw error;
    }
  }
}
