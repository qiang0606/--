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

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export interface SendMessageRequest {
  conversationId: string
  content: string
  type?: 'text' | 'image' | 'file'
}

export const chatApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/chat/conversations')
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
}

