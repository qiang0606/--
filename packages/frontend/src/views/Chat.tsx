import { defineComponent, onMounted, watch } from "vue";
import ChatLayout from "@/components/ChatLayout.tsx";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import { useAccountStore } from "@/stores/account";
import { socketService } from "@/services/socket";

export default defineComponent({
  name: "Chat",
  setup() {
    const chatStore = useChatStore();
    const authStore = useAuthStore();
    const accountStore = useAccountStore();

    onMounted(async () => {
      // 初始化 WebSocket
      if (authStore.token) {
        socketService.connect(authStore.token);
        chatStore.initSocketListeners();
      }
      // 加载对话列表
      await chatStore.fetchConversations();
    });

    // 监听托管账号变化，重新加载对话列表
    watch(
      () => accountStore.currentManagedAccount?.id,
      async (accountId) => {
        await chatStore.fetchConversations(accountId);
      }
    );

    return () => <ChatLayout />;
  },
});
