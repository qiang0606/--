import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ManagedAccountDocument = ManagedAccount & Document

@Schema({ timestamps: true })
export class ManagedAccount {
  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  nickname: string

  @Prop()
  avatar?: string

  @Prop({ default: 'offline' })
  status: 'online' | 'offline'

  @Prop()
  lastActiveTime?: Date

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId
}

export const ManagedAccountSchema = SchemaFactory.createForClass(ManagedAccount)

