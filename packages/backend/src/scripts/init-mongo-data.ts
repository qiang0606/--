import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { AuthService } from '../auth/auth.service'
import { AccountService } from '../account/account.service'
import * as bcrypt from 'bcryptjs'

async function initData() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const authService = app.get(AuthService)
  const accountService = app.get(AccountService)

  try {
    // 创建测试用户
    try {
      await authService.register('admin', '123456', '管理员')
      console.log('✅ 创建用户: admin / 123456')
    } catch (error) {
      console.log('ℹ️  用户已存在或创建失败')
    }

    // 获取用户
    const user = await authService.validateUser('admin', '123456')
    if (!user) {
      console.error('❌ 无法获取用户')
      await app.close()
      return
    }

    // 创建托管账号
    try {
      await accountService.createManagedAccount(
        user.id,
        'account1',
        '账号1',
        undefined,
      )
      console.log('✅ 创建托管账号: account1')
    } catch (error) {
      console.log('ℹ️  账号1已存在')
    }

    try {
      await accountService.createManagedAccount(
        user.id,
        'account2',
        '账号2',
        undefined,
      )
      console.log('✅ 创建托管账号: account2')
    } catch (error) {
      console.log('ℹ️  账号2已存在')
    }

    // 创建更多测试用户（作为好友）
    const testUsers = []
    for (let i = 1; i <= 5; i++) {
      try {
        const testUser = await authService.register(
          `user${i}`,
          '123456',
          `用户${i}`,
        )
        testUsers.push(testUser)
        console.log(`✅ 创建测试用户: user${i} / 123456`)
      } catch (error) {
        // 用户可能已存在，尝试获取
        const existingUser = await authService.validateUser(`user${i}`, '')
        if (existingUser) {
          testUsers.push(existingUser)
        }
      }
    }

    // 获取账号
    const accounts = await accountService.getManagedAccounts(user.id)
    const account1 = accounts.find((a) => a.username === 'account1')
    const account2 = accounts.find((a) => a.username === 'account2')

    // 为账号1创建好友（使用测试用户）
    if (account1 && testUsers.length > 0) {
      const friends1 = [
        { friendUserId: testUsers[0].id, remark: '小A' },
        { friendUserId: testUsers[1]?.id || testUsers[0].id, remark: '小B' },
        { friendUserId: testUsers[2]?.id || testUsers[0].id, remark: '小C' },
      ]

      for (const friendData of friends1) {
        try {
          await accountService.createFriend(
            user.id,
            friendData.friendUserId,
            friendData.remark,
          )
          console.log(`✅ 为用户创建好友: ${friendData.remark}`)
        } catch (error) {
          console.log(`ℹ️  好友已存在`)
        }
      }
    }

    // 为账号2创建好友
    if (account2 && testUsers.length > 2) {
      const friends2 = [
        { friendUserId: testUsers[3]?.id || testUsers[0].id, remark: '小D' },
        { friendUserId: testUsers[4]?.id || testUsers[0].id, remark: '小E' },
      ]

      for (const friendData of friends2) {
        try {
          await accountService.createFriend(
            user.id,
            friendData.friendUserId,
            friendData.remark,
          )
          console.log(`✅ 为用户创建好友: ${friendData.remark}`)
        } catch (error) {
          console.log(`ℹ️  好友已存在`)
        }
      }
    }

    console.log('✅ 数据初始化完成')
  } catch (error) {
    console.error('❌ 初始化失败:', error)
  } finally {
    await app.close()
  }
}

initData()

