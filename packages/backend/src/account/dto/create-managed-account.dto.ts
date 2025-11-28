import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateManagedAccountDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsOptional()
  @IsString()
  avatar?: string
}

