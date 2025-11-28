import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ClientAuthController } from "./client-auth.controller";
import { ClientAuthService } from "./client-auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { User, UserSchema } from "../entities/user.schema";
import { ClientUser, ClientUserSchema } from "../entities/client-user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ClientUser.name, schema: ClientUserSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "chathub-secret-key",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController, ClientAuthController],
  providers: [AuthService, ClientAuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, ClientAuthService],
})
export class AuthModule {}
