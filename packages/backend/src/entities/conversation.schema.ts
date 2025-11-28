import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ConversationDocument = Conversation & Document

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  type: 'private' | 'group'

  @Prop({ required: true })
  name: string

  @Prop()
  avatar?: string

  @Prop()
  lastMessage?: string

  @Prop()
  lastMessageTime?: Date

  @Prop({ default: 0 })
  unreadCount: number

  @Prop({ type: [String], default: [] })
  participants: string[]

  @Prop({ type: Types.ObjectId, ref: 'ManagedAccount' })
  managedAccountId?: Types.ObjectId
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)

