import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Conversation, ConversationDocument } from '../entities/conversation.schema'
import { Message, MessageDocument } from '../entities/message.schema'
import { UserFriend, UserFriendDocument } from '../entities/user-friend.schema'
import { ManagedAccount, ManagedAccountDocument } from '../entities/managed-account.schema'
import { ClientUser, ClientUserDocument } from '../entities/client-user.schema'

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(UserFriend.name)
    private userFriendModel: Model<UserFriendDocument>,
    @InjectModel(ManagedAccount.name)
    private managedAccountModel: Model<ManagedAccountDocument>,
    @InjectModel(ClientUser.name)
    private clientUserModel: Model<ClientUserDocument>,
  ) {}

  async getConversations(userId: string, managedAccountId?: string, userType?: 'manager' | 'client'): Promise<any[]> {
    const query: any = {}
    
    if (userType === 'client') {
      // 客户端用户：查询参与者包含该用户ID的对话
      query.participants = userId
    } else {
      // 管理端用户：查询托管账号的对话
      if (managedAccountId) {
        query.managedAccountId = new Types.ObjectId(managedAccountId)
      } else {
        query.managedAccountId = null
      }
    }
    
    const conversations = await this.conversationModel
      .find(query)
      .sort({ lastMessageTime: -1 })
      .exec()
    return conversations.map((conv) => ({
      ...conv.toObject(),
      id: conv._id.toString(),
      managedAccountId: conv.managedAccountId?.toString(),
    }))
  }

  async getConversationById(conversationId: string): Promise<any> {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec()
    if (!conversation) {
      return null
    }
    return {
      ...conversation.toObject(),
      id: conversation._id.toString(),
      managedAccountId: conversation.managedAccountId?.toString(),
    }
  }

  async getMessages(conversationId: string): Promise<any[]> {
    const messages = await this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ timestamp: 1 })
      .exec()
    return messages.map((msg) => ({
      ...msg.toObject(),
      id: msg._id.toString(),
      conversationId: msg.conversationId.toString(),
    }))
  }

  async createConversation(
    friendId: string,
    managedAccountId: string,
  ): Promise<any> {
    // friendId 是 UserFriend 的 ID，需要获取对应的客户端用户信息
    const friend = await this.userFriendModel
      .findById(friendId)
      .populate('clientUserId')
      .exec()
    if (!friend) {
      throw new Error('好友关系不存在，请先添加该用户为好友')
    }
    
    // 验证托管账号是否匹配
    if (friend.managedAccountId.toString() !== managedAccountId) {
      throw new Error('托管账号不匹配')
    }

    const clientUser = friend.clientUserId as any
    const clientUserId = clientUser?._id?.toString() || clientUser?.id

    const query: any = {
      participants: clientUserId,
      managedAccountId: new Types.ObjectId(managedAccountId),
    }

    const existing = await this.conversationModel.findOne(query).exec()

    if (existing) {
      return {
        ...existing.toObject(),
        id: existing._id.toString(),
        managedAccountId: existing.managedAccountId?.toString(),
      }
    }
    
    const conversation = new this.conversationModel({
      type: 'private',
      name: friend.remark || clientUser?.nickname || '未知用户',
      avatar: clientUser?.avatar,
      participants: [clientUserId],
      managedAccountId: new Types.ObjectId(managedAccountId),
    })

    const saved = await conversation.save()
    return {
      ...saved.toObject(),
      id: saved._id.toString(),
      managedAccountId: saved.managedAccountId?.toString(),
    }
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderAvatar: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
  ): Promise<any> {
    const message = new this.messageModel({
      conversationId: new Types.ObjectId(conversationId),
      senderId,
      senderName,
      senderAvatar,
      content,
      type,
    })

    const savedMessage = await message.save()

    // 更新对话的最后消息
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec()
    if (conversation) {
      conversation.lastMessage = content
      conversation.lastMessageTime = new Date()
      conversation.unreadCount += 1
      await conversation.save()
    }

    // 返回完整的消息对象，确保包含所有必要字段
    const messageObj = savedMessage.toObject()
    return {
      id: messageObj._id.toString(),
      conversationId: messageObj.conversationId.toString(),
      senderId: messageObj.senderId,
      senderName: messageObj.senderName,
      senderAvatar: messageObj.senderAvatar || '',
      content: messageObj.content,
      type: messageObj.type || 'text',
      timestamp: messageObj.timestamp ? new Date(messageObj.timestamp).toISOString() : new Date().toISOString(),
      read: messageObj.read || false,
    }
  }

  async markAsRead(conversationId: string): Promise<void> {
    await this.messageModel
      .updateMany(
        { conversationId: new Types.ObjectId(conversationId) },
        { read: true },
      )
      .exec()
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec()
    if (conversation) {
      conversation.unreadCount = 0
      await conversation.save()
    }
  }

  async getManagedAccountOwner(managedAccountId: string): Promise<string | null> {
    const account = await this.managedAccountModel
      .findById(managedAccountId)
      .exec()
    if (!account) {
      return null
    }
    return account.ownerId.toString()
  }

  async getManagedAccountById(managedAccountId: string): Promise<ManagedAccountDocument | null> {
    return this.managedAccountModel.findById(managedAccountId).exec()
  }

  async getClientUserById(clientUserId: string): Promise<ClientUserDocument | null> {
    return this.clientUserModel.findById(clientUserId).exec()
  }
}
