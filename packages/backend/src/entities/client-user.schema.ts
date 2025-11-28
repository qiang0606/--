import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ClientUserDocument = ClientUser & Document

@Schema({ timestamps: true })
export class ClientUser {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  nickname: string

  @Prop()
  avatar?: string

  @Prop()
  email?: string

  @Prop()
  phone?: string
}

export const ClientUserSchema = SchemaFactory.createForClass(ClientUser)

