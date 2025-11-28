import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'
import { AuthModule } from '../auth/auth.module'
import { ManagedAccount, ManagedAccountSchema } from '../entities/managed-account.schema'
import { UserFriend, UserFriendSchema } from '../entities/user-friend.schema'
import { ClientUser, ClientUserSchema } from '../entities/client-user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ManagedAccount.name, schema: ManagedAccountSchema },
      { name: UserFriend.name, schema: UserFriendSchema },
      { name: ClientUser.name, schema: ClientUserSchema },
    ]),
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}

