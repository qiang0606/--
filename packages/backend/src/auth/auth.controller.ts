import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    try {
      // 检查用户名是否已存在
      const existingUser = await this.authService.validateUser(
        registerDto.username,
        ""
      );
      if (existingUser) {
        throw new HttpException("用户名已存在", HttpStatus.BAD_REQUEST);
      }

      const user = await this.authService.register(
        registerDto.username,
        registerDto.password,
        registerDto.nickname,
        registerDto.email,
        registerDto.phone
      );
      // 注册成功后自动登录
      return this.authService.login({ ...user, id: user.id });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("注册失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password
    );
    if (!user) {
      throw new HttpException("用户名或密码错误", HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async getProfile(@Request() req) {
    const user = await this.authService.findById(req.user.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { password: _, ...result } = user.toObject();
    return { ...result, id: user._id.toString() };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("client-users")
  async getClientUsers(@Request() req) {
    // 获取所有客户端用户列表（用于选择好友）
    // 这里需要注入 ClientAuthService，但为了避免循环依赖，我们通过 AccountService 来获取
    // 或者直接在 AccountController 中处理
    throw new HttpException("请使用 /accounts/client-users 接口", HttpStatus.BAD_REQUEST);
  }
}
