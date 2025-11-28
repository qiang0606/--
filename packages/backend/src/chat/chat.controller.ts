import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get("conversations")
  async getConversations(@Request() req) {
    // 可以从查询参数获取 managedAccountId
    const managedAccountId = req.query?.managedAccountId as string | undefined;
    // 从JWT payload中获取用户类型，默认为 'manager'
    const userType = (req.user as any)?.userType || "manager";
    return this.chatService.getConversations(
      req.user.userId,
      managedAccountId,
      userType
    );
  }

  @Get("conversations/:id/messages")
  async getMessages(@Param("id") id: string) {
    return this.chatService.getMessages(id);
  }

  @Post("conversations")
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(
      dto.friendId,
      dto.managedAccountId
    );
  }

  @Post("messages")
  async sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    // 这里应该从请求中获取发送者信息
    // 简化处理，实际应该从 managedAccount 或 user 中获取
    const message = await this.chatService.sendMessage(
      dto.conversationId,
      req.user.userId,
      req.user.username,
      "",
      dto.content,
      dto.type
    );
    return message;
  }

  @Post("conversations/:id/read")
  async markAsRead(@Param("id") id: string) {
    await this.chatService.markAsRead(id);
    return { success: true };
  }
}
