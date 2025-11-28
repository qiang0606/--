import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chathub-secret-key',
    })
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username,
      userType: payload.type || 'manager' // 'manager' or 'client'
    }
  }
}

