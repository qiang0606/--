import { defineComponent, onMounted } from 'vue'
import ChatLayout from '@/components/ChatLayout.tsx'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { socketService } from '@/services/socket'

export default defineComponent({
  name: 'Chat',
  setup() {
    const chatStore = useChatStore()
    const authStore = useAuthStore()

    onMounted(async () => {
      // 初始化 WebSocket
      if (authStore.token) {
        socketService.connect(authStore.token)
        chatStore.initSocketListeners()
      }
      // 加载对话列表
      await chatStore.fetchConversations()
    })

    return () => <ChatLayout />
  },
})

