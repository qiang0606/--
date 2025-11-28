import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type FriendDocument = Friend & Document

@Schema({ timestamps: true })
export class Friend {
  @Prop({ required: true })
  nickname: string

  @Prop()
  avatar?: string

  @Prop()
  remark?: string

  @Prop({ default: 'offline' })
  status: 'online' | 'offline'

  @Prop()
  lastMessage?: string

  @Prop()
  lastMessageTime?: Date

  @Prop({ default: 0 })
  unreadCount: number

  @Prop({ required: true, type: Types.ObjectId, ref: 'ManagedAccount' })
  accountId: Types.ObjectId
}

export const FriendSchema = SchemaFactory.createForClass(Friend)

