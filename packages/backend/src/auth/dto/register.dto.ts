import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: '密码至少6位' })
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

