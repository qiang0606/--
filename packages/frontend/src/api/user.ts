import axios from 'axios'
import type { User } from '@/types/user'

const api = axios.create({
  baseURL: '/api',
})

// 请求拦截器，动态添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const userApi = {
  getClientUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/accounts/client-users')
    return response.data
  },
}

