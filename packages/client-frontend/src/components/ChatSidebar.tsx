import { defineComponent, computed, ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { ElInput, ElAvatar, ElBadge } from "element-plus";
import { Search } from "@element-plus/icons-vue";

export default defineComponent({
  name: "ChatSidebar",
  setup() {
    const chatStore = useChatStore();
    const searchKeyword = ref("");

    const filteredConversations = computed(() => {
      if (!searchKeyword.value) {
        return chatStore.conversations;
      }
      return chatStore.conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    });

    const handleSelectConversation = (conversationId: string) => {
      chatStore.selectConversation(conversationId);
    };

    const formatTime = (time?: string) => {
      if (!time) return "";
      const date = new Date(time);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) {
        return date.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (days === 1) {
        return "昨天";
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return date.toLocaleDateString("zh-CN");
      }
    };

    return () => (
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* 搜索框 */}
        <div class="p-4 border-b border-gray-200">
          <ElInput
            modelValue={searchKeyword.value}
            onUpdate:modelValue={(val) => (searchKeyword.value = val)}
            placeholder="搜索对话"
            clearable
            prefixIcon={Search}
          />
        </div>

        {/* 对话列表 */}
        <div class="flex-1 overflow-y-auto">
          {filteredConversations.value.length === 0 ? (
            <div class="flex items-center justify-center h-full text-gray-500">
              暂无对话
            </div>
          ) : (
            filteredConversations.value.map((conv) => (
              <div
                key={conv.id}
                class={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  chatStore.currentConversation?.id === conv.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <div class="flex items-center gap-3">
                  <ElBadge
                    value={conv.unreadCount}
                    hidden={conv.unreadCount === 0}
                  >
                    <ElAvatar src={conv.avatar} size={48} class="flex-shrink-0">
                      {conv.name[0]}
                    </ElAvatar>
                  </ElBadge>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-sm font-semibold text-gray-900 truncate">
                        {conv.name}
                      </span>
                      <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 truncate">
                      {conv.lastMessage || ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
});
