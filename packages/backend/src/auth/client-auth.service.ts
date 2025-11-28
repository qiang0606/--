import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { ClientUser, ClientUserDocument } from '../entities/client-user.schema'

@Injectable()
export class ClientAuthService {
  constructor(
    @InjectModel(ClientUser.name)
    private clientUserModel: Model<ClientUserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.clientUserModel.findOne({ username }).exec()
    if (!user) {
      return null
    }
    // 如果密码为空，只检查用户是否存在（用于检查用户名是否已存在）
    if (!password) {
      return { ...user.toObject(), id: user._id.toString() }
    }
    if (await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user.toObject()
      return { ...result, id: user._id.toString() }
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, type: 'client' }
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
      },
    }
  }

  async register(
    username: string,
    password: string,
    nickname: string,
    email?: string,
    phone?: string,
  ) {
    // 检查用户名是否已存在
    const existingUser = await this.clientUserModel.findOne({ username }).exec()
    if (existingUser) {
      throw new Error('用户名已存在')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new this.clientUserModel({
      username,
      password: hashedPassword,
      nickname,
      email,
      phone,
    })
    const savedUser = await user.save()
    const { password: _, ...result } = savedUser.toObject()
    return { ...result, id: savedUser._id.toString() }
  }

  async findById(id: string): Promise<ClientUserDocument | null> {
    return this.clientUserModel.findById(id).exec()
  }

  async getAllUsers(): Promise<any[]> {
    const users = await this.clientUserModel.find().select('-password').exec()
    return users.map((user) => ({
      ...user.toObject(),
      id: user._id.toString(),
    }))
  }
}

