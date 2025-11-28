import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type MessageDocument = Message & Document

@Schema({ timestamps: { createdAt: 'timestamp', updatedAt: false } })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Conversation' })
  conversationId: Types.ObjectId

  @Prop({ required: true })
  senderId: string

  @Prop({ required: true })
  senderName: string

  @Prop()
  senderAvatar?: string

  @Prop({ required: true })
  content: string

  @Prop({ default: 'text' })
  type: 'text' | 'image' | 'file' | 'system'

  @Prop({ default: false })
  read: boolean

  timestamp: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)

