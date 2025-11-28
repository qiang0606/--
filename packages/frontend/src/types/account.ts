export interface ManagedAccount {
  id: string
  username: string
  nickname: string
  avatar?: string
  status: 'online' | 'offline'
  lastActiveTime?: string
}

export interface Friend {
  id: string
  nickname: string
  avatar?: string
  remark?: string
  status: 'online' | 'offline'
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

