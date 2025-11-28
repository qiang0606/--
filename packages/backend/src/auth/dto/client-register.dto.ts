import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

export class ClientRegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string
}

