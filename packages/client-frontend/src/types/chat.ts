export interface Conversation {
  id: string
  type: 'private' | 'group'
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  participants: string[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  timestamp: string
  read: boolean
}

