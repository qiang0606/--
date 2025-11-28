import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Conversation, Message } from '@/types/chat'
import { chatApi } from '@/api/chat'
import { socketService } from '@/services/socket'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const messages = ref<Message[]>([])
  const unreadCount = ref(0)

  // 获取对话列表
  const fetchConversations = async (managedAccountId?: string) => {
    const list = await chatApi.getConversations(managedAccountId)
    conversations.value = list
    return list
  }

  // 选择对话
  const selectConversation = async (conversationId: string) => {
    const conversation = conversations.value.find((c) => c.id === conversationId)
    if (conversation) {
      currentConversation.value = conversation
      await fetchMessages(conversationId)
      // 标记为已读
      await markAsRead(conversationId)
    }
  }

  // 获取消息列表
  const fetchMessages = async (conversationId: string) => {
    const messageList = await chatApi.getMessages(conversationId)
    messages.value = messageList
    return messageList
  }

  // 发送消息
  const sendMessage = async (content: string, conversationId?: string) => {
    const targetId = conversationId || currentConversation.value?.id
    if (!targetId) return

    const message = await chatApi.sendMessage({
      conversationId: targetId,
      content,
    })
    messages.value.push(message)
    return message
  }

  // 接收消息（通过 WebSocket）
  const receiveMessage = (message: Message) => {
    messages.value.push(message)
    // 如果不在当前对话，增加未读数
    if (message.conversationId !== currentConversation.value?.id) {
      unreadCount.value++
    }
  }

  // 标记为已读
  const markAsRead = async (conversationId: string) => {
    await chatApi.markAsRead(conversationId)
    const conversation = conversations.value.find((c) => c.id === conversationId)
    if (conversation) {
      conversation.unreadCount = 0
    }
  }

  // 初始化 WebSocket 监听
  const initSocketListeners = () => {
    socketService.onMessage((message: Message) => {
      receiveMessage(message)
    })
  }

  return {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    fetchConversations,
    selectConversation,
    fetchMessages,
    sendMessage,
    receiveMessage,
    markAsRead,
    initSocketListeners,
  }
})

