import { defineComponent, computed } from 'vue'
import ChatHeader from './ChatHeader.tsx'
import ChatSidebar from './ChatSidebar.tsx'
import ChatMain from './ChatMain.tsx'
import ChatRightPanel from './ChatRightPanel.tsx'
import AccountSelector from './AccountSelector.tsx'
import FriendList from './FriendList.tsx'
import { useAccountStore } from '@/stores/account'
import { useChatStore } from '@/stores/chat'

export default defineComponent({
  name: 'ChatLayout',
  setup() {
    const accountStore = useAccountStore()
    const chatStore = useChatStore()
    const showAccountSelector = computed(() => !accountStore.currentManagedAccount)
    const showFriendList = computed(() => 
      accountStore.currentManagedAccount && !chatStore.currentConversation
    )

    return () => (
      <div class="h-screen flex flex-col bg-gray-50">
        <ChatHeader />
        <div class="flex-1 flex overflow-hidden">
          {showAccountSelector.value ? (
            <div class="flex-1 flex items-center justify-center p-8">
              <AccountSelector />
            </div>
          ) : showFriendList.value ? (
            <>
              <ChatSidebar />
              <FriendList />
              <ChatRightPanel />
            </>
          ) : (
            <>
              <ChatSidebar />
              <ChatMain />
              <ChatRightPanel />
            </>
          )}
        </div>
      </div>
    )
  },
})
