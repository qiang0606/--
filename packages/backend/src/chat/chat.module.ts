import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { Conversation, ConversationSchema } from '../entities/conversation.schema'
import { Message, MessageSchema } from '../entities/message.schema'
import { UserFriend, UserFriendSchema } from '../entities/user-friend.schema'
import { ManagedAccount, ManagedAccountSchema } from '../entities/managed-account.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: UserFriend.name, schema: UserFriendSchema },
      { name: ManagedAccount.name, schema: ManagedAccountSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chathub-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}

