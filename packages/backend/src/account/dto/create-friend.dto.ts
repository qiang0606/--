import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateFriendDto {
  @IsString()
  @IsNotEmpty()
  clientUserId: string

  @IsOptional()
  @IsString()
  remark?: string
}

