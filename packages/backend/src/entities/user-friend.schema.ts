import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserFriendDocument = UserFriend & Document;

@Schema({ timestamps: true })
export class UserFriend {
  @Prop()
  remark?: string;

  @Prop({ default: "offline" })
  status: "online" | "offline";

  @Prop()
  lastMessage?: string;

  @Prop()
  lastMessageTime?: Date;

  @Prop({ default: 0 })
  unreadCount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: "ManagedAccount" })
  managedAccountId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "ClientUser" })
  clientUserId: Types.ObjectId;
}

export const UserFriendSchema = SchemaFactory.createForClass(UserFriend);
