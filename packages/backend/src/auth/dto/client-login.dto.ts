import { IsString, IsNotEmpty } from 'class-validator'

export class ClientLoginDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}

