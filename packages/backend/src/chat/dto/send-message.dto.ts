import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator'

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsOptional()
  @IsEnum(['text', 'image', 'file'])
  type?: 'text' | 'image' | 'file'
}

