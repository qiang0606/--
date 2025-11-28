import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AccountService } from "./account.service";
import { ClientAuthService } from "../auth/client-auth.service";
import { CreateManagedAccountDto } from "./dto/create-managed-account.dto";
import { CreateFriendDto } from "./dto/create-friend.dto";

@Controller("accounts")
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    private accountService: AccountService,
    private clientAuthService: ClientAuthService,
  ) {}

  @Get("managed")
  async getManagedAccounts(@Request() req) {
    return this.accountService.getManagedAccounts(req.user.userId);
  }

  @Post("managed")
  async createManagedAccount(
    @Request() req,
    @Body() dto: CreateManagedAccountDto
  ) {
    const account = await this.accountService.createManagedAccount(
      req.user.userId,
      dto.username,
      dto.nickname,
      dto.avatar
    );
    return {
      ...account.toObject(),
      id: account._id.toString(),
      ownerId: account.ownerId.toString(),
    };
  }

  @Get("managed/:accountId/friends")
  async getFriends(@Request() req, @Param("accountId") accountId: string) {
    // 验证托管账号是否属于当前用户
    const accounts = await this.accountService.getManagedAccounts(req.user.userId);
    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      throw new HttpException("托管账号不存在或无权限", HttpStatus.FORBIDDEN);
    }
    const friends = await this.accountService.getFriends(accountId);
    return friends;
  }

  @Post("managed/:accountId/friends")
  async createFriend(
    @Request() req,
    @Param("accountId") accountId: string,
    @Body() dto: CreateFriendDto
  ) {
    try {
      // 验证托管账号是否属于当前用户
      const accounts = await this.accountService.getManagedAccounts(req.user.userId);
      const account = accounts.find((a) => a.id === accountId);
      if (!account) {
        throw new HttpException("托管账号不存在或无权限", HttpStatus.FORBIDDEN);
      }

      const friend = await this.accountService.createFriend(
        accountId,
        dto.clientUserId,
        dto.remark
      );
      // 填充客户端用户信息
      await friend.populate("clientUserId", "nickname avatar username");
      const clientUser = friend.clientUserId as any;
      return {
        id: friend._id.toString(),
        managedAccountId: friend.managedAccountId.toString(),
        clientUserId: clientUser?._id?.toString() || clientUser?.id,
        nickname: clientUser?.nickname || "",
        avatar: clientUser?.avatar,
        username: clientUser?.username || "",
        remark: friend.remark,
        status: friend.status,
        lastMessage: friend.lastMessage,
        lastMessageTime: friend.lastMessageTime,
        unreadCount: friend.unreadCount,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "添加好友失败，请稍后重试",
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("client-users")
  async getClientUsers(@Request() req) {
    // 获取所有客户端用户列表（用于选择好友）
    return this.clientAuthService.getAllUsers();
  }
}
