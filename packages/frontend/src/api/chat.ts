import axios from 'axios'
import type { Conversation, Message } from '@/types/chat'

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

export interface SendMessageRequest {
  conversationId: string
  content: string
  type?: 'text' | 'image' | 'file'
}

export const chatApi = {
  getConversations: async (managedAccountId?: string): Promise<Conversation[]> => {
    const params = managedAccountId ? { managedAccountId } : {}
    const response = await api.get<Conversation[]>('/chat/conversations', { params })
    return response.data
  },
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/chat/conversations/${conversationId}/messages`)
    return response.data
  },
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await api.post<Message>('/chat/messages', data)
    return response.data
  },
  markAsRead: async (conversationId: string): Promise<void> => {
    await api.post(`/chat/conversations/${conversationId}/read`)
  },
  createConversation: async (friendId: string, managedAccountId?: string): Promise<Conversation> => {
    const response = await api.post<Conversation>('/chat/conversations', {
      friendId,
      managedAccountId,
    })
    return response.data
  },
}

