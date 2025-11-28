import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ClientAuthService } from './client-auth.service'
import { ClientLoginDto } from './dto/client-login.dto'
import { ClientRegisterDto } from './dto/client-register.dto'

@Controller('client-auth')
export class ClientAuthController {
  constructor(private clientAuthService: ClientAuthService) {}

  @Post('register')
  async register(@Body() registerDto: ClientRegisterDto) {
    try {
      // 检查用户名是否已存在
      const existingUser = await this.clientAuthService.validateUser(
        registerDto.username,
        '',
      )
      if (existingUser) {
        throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
      }

      const user = await this.clientAuthService.register(
        registerDto.username,
        registerDto.password,
        registerDto.nickname,
        registerDto.email,
        registerDto.phone,
      )
      // 注册成功后自动登录
      return this.clientAuthService.login({ ...user, id: user.id })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('login')
  async login(@Body() loginDto: ClientLoginDto) {
    const user = await this.clientAuthService.validateUser(
      loginDto.username,
      loginDto.password,
    )
    if (!user) {
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED)
    }
    return this.clientAuthService.login(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.clientAuthService.findById(req.user.userId)
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND)
    }
    const { password: _, ...result } = user.toObject()
    return { ...result, id: user._id.toString() }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  async getClientUsers(@Request() req) {
    // 获取所有客户端用户列表（用于管理端选择好友）
    return this.clientAuthService.getAllUsers()
  }
}

