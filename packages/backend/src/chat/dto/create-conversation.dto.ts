import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  friendId: string

  @IsOptional()
  @IsString()
  managedAccountId?: string
}

