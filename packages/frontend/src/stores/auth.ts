import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'
import { authApi, type RegisterRequest } from '@/api/auth'
import { socketService } from '@/services/socket'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('token', response.token)
    return response
  }

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('token', response.token)
    return response
  }

  const logout = () => {
    // 断开 WebSocket 连接
    socketService.disconnect()
    
    // 清理用户数据
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    
    // 清理其他 store 的状态（通过重置 store）
    // 注意：这里不能直接导入其他 store，因为会造成循环依赖
    // 应该在组件中调用其他 store 的清理方法
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  return {
    user,
    token,
    register,
    login,
    logout,
    setUser,
  }
})

