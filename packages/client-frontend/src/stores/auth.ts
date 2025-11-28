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
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    // Disconnect WebSocket on logout
    socketService.disconnect()
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

