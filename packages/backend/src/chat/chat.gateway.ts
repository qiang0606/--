import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { ChatService } from './chat.service'

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  // 存储用户ID到Socket连接的映射
  private userSockets = new Map<string, Set<Socket>>()

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers.authorization?.split(' ')[1]
      if (token) {
        const payload = this.jwtService.verify(token)
        client.data.userId = payload.sub
        client.data.username = payload.username
        client.data.userType = payload.type || 'manager' // 'manager' or 'client'
        
        // 将socket添加到用户映射中
        if (!this.userSockets.has(client.data.userId)) {
          this.userSockets.set(client.data.userId, new Set())
        }
        this.userSockets.get(client.data.userId)!.add(client)
        
        console.log(`Client connected: ${client.data.username} (${client.data.userType})`)
      } else {
        client.disconnect()
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client)
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId)
      }
    }
    console.log(`Client disconnected: ${client.data.username}`)
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    // 获取对话信息，确定发送者信息
    const conversation = await this.chatService.getConversationById(data.conversationId)
    if (!conversation) {
      return
    }

    let senderId = client.data.userId
    let senderName = client.data.username
    let senderAvatar = ''

    // 如果是管理端用户，且对话有托管账号，使用托管账号信息作为发送者
    if (client.data.userType === 'manager' && conversation.managedAccountId) {
      const managedAccount = await this.chatService.getManagedAccountById(
        conversation.managedAccountId.toString()
      )
      if (managedAccount) {
        senderId = managedAccount._id.toString()
        senderName = managedAccount.nickname
        senderAvatar = managedAccount.avatar || ''
      }
    } else if (client.data.userType === 'client') {
      // 如果是客户端用户，获取客户端用户信息
      const clientUser = await this.chatService.getClientUserById(client.data.userId)
      if (clientUser) {
        senderId = clientUser._id.toString()
        senderName = clientUser.nickname
        senderAvatar = clientUser.avatar || ''
      }
    }

    // 发送消息
    const message = await this.chatService.sendMessage(
      data.conversationId,
      senderId,
      senderName,
      senderAvatar,
      data.content,
    )

    // 发送消息给对话的所有参与者（客户端用户）
    const participants = conversation.participants || []
    const managedAccountId = conversation.managedAccountId?.toString()
    
    // 收集需要接收消息的用户ID
    const targetUserIds = new Set<string>()
    
    // 添加参与者（客户端用户）
    participants.forEach((participantId: string) => {
      targetUserIds.add(participantId)
    })
    
    // 如果对话有托管账号，找到管理该托管账号的用户
    if (managedAccountId) {
      const ownerId = await this.chatService.getManagedAccountOwner(managedAccountId)
      if (ownerId) {
        targetUserIds.add(ownerId)
      }
    }

    // 发送消息给所有目标用户
    targetUserIds.forEach((userId) => {
      const sockets = this.userSockets.get(userId)
      if (sockets) {
        sockets.forEach((socket) => {
          socket.emit('message', message)
        })
      }
    })
  }
}

