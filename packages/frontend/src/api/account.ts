import axios from 'axios'
import type { ManagedAccount, Friend } from '@/types/account'

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

export interface CreateManagedAccountRequest {
  username: string
  nickname: string
  avatar?: string
}

export interface CreateFriendRequest {
  clientUserId: string
  remark?: string
}

export const accountApi = {
  getManagedAccounts: async (): Promise<ManagedAccount[]> => {
    const response = await api.get<ManagedAccount[]>('/accounts/managed')
    return response.data
  },
  createManagedAccount: async (data: CreateManagedAccountRequest): Promise<ManagedAccount> => {
    const response = await api.post<ManagedAccount>('/accounts/managed', data)
    return response.data
  },
  getFriends: async (managedAccountId: string): Promise<Friend[]> => {
    const response = await api.get<Friend[]>(`/accounts/managed/${managedAccountId}/friends`)
    return response.data
  },
  createFriend: async (managedAccountId: string, data: CreateFriendRequest): Promise<Friend> => {
    const response = await api.post<Friend>(`/accounts/managed/${managedAccountId}/friends`, data)
    return response.data
  },
}

