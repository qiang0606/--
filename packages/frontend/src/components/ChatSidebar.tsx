import { defineComponent, onMounted, computed, ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useAccountStore } from "@/stores/account";
import { ElInput, ElAvatar, ElBadge, ElButton } from "element-plus";
import { ArrowLeft, Search, Setting } from "@element-plus/icons-vue";

export default defineComponent({
  name: "ChatSidebar",
  setup() {
    const chatStore = useChatStore();
    const accountStore = useAccountStore();
    const searchKeyword = ref("");
    const activeFilter = ref("all");

    const filteredConversations = computed(() => {
      let result = chatStore.conversations;
      if (searchKeyword.value) {
        result = result.filter((conv) =>
          conv.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
      }
      if (activeFilter.value === "private") {
        result = result.filter((conv) => conv.type === "private");
      } else if (activeFilter.value === "group") {
        result = result.filter((conv) => conv.type === "group");
      }
      return result;
    });

    const handleSelectConversation = (conversationId: string) => {
      chatStore.selectConversation(conversationId);
    };

    const handleBack = () => {
      accountStore.clearManagedAccount();
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
      <div class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* 顶部用户信息 */}
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700">我的</span>
              <span class="text-xs text-gray-500">0/0</span>
            </div>
            <span class="text-sm text-gray-600">
              《{accountStore.currentManagedAccount?.nickname || "未选择"}
            </span>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span class="text-sm text-gray-600">排队</span>
            <span class="text-sm font-semibold text-blue-600">94</span>
          </div>
        </div>

        {/* 筛选标签 */}
        <div class="px-4 py-2 border-b border-gray-200">
          <div class="flex gap-2 mb-2">
            <button
              class={`px-3 py-1 text-xs rounded ${
                activeFilter.value === "all"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => (activeFilter.value = "all")}
            >
              全部对话
            </button>
            <button
              class={`px-3 py-1 text-xs rounded ${
                activeFilter.value === "private"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => (activeFilter.value = "private")}
            >
              私聊对话
            </button>
            <button
              class={`px-3 py-1 text-xs rounded ${
                activeFilter.value === "group"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => (activeFilter.value = "group")}
            >
              群聊对话
            </button>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600">
              全部
            </button>
            <button class="px-3 py-1 text-xs rounded text-gray-600 hover:bg-gray-100">
              @我
            </button>
            <button class="px-3 py-1 text-xs rounded text-gray-600 hover:bg-gray-100">
              内部
            </button>
            <button class="px-3 py-1 text-xs rounded text-gray-600 hover:bg-gray-100">
              外部
            </button>
          </div>
        </div>

        {/* 搜索框 */}
        <div class="px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <span>账号视图</span>
            <Search class="w-4 h-4" />
          </div>
          <ElInput
            modelValue={searchKeyword.value}
            onUpdate:modelValue={(val) => (searchKeyword.value = val)}
            placeholder="搜索对话"
            clearable
            size="small"
          />
        </div>

        {/* 对话列表 */}
        <div class="flex-1 overflow-y-auto">
          {filteredConversations.value.map((conv) => (
            <div
              key={conv.id}
              class={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                chatStore.currentConversation?.id === conv.id
                  ? "bg-blue-50 border-l-2 border-blue-500"
                  : ""
              }`}
              onClick={() => handleSelectConversation(conv.id)}
            >
              <div class="flex items-start gap-3">
                <ElBadge
                  value={conv.unreadCount}
                  hidden={conv.unreadCount === 0}
                >
                  <ElAvatar src={conv.avatar} size={40} class="flex-shrink-0">
                    {conv.name[0]}
                  </ElAvatar>
                </ElBadge>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-900 truncate">
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
          ))}
        </div>

        {/* 底部设置 */}
        <div class="px-4 py-2 border-t border-gray-200">
          <ElButton text class="w-full justify-start">
            <Setting class="w-4 h-4 mr-2" />
            <span class="text-sm">设置</span>
          </ElButton>
        </div>
      </div>
    );
  },
});
