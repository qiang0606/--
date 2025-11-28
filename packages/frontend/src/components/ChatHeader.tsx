import { defineComponent, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAccountStore } from "@/stores/account";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
  ElTabs,
  ElTabPane,
} from "element-plus";
import { Bell, QuestionFilled, Connection } from "@element-plus/icons-vue";

export default defineComponent({
  name: "ChatHeader",
  setup() {
    const authStore = useAuthStore();
    const accountStore = useAccountStore();
    const chatStore = useChatStore();
    const router = useRouter();
    const activeTab = ref("aggregated");

    const handleLogout = () => {
      // 清理所有 store 的状态
      authStore.logout();
      accountStore.clearManagedAccount();
      // 清理聊天相关状态
      chatStore.conversations = [];
      chatStore.currentConversation = null;
      chatStore.messages = [];
      chatStore.unreadCount = 0;
      
      ElMessage.success("已退出登录");
      router.push("/login");
    };

    return () => (
      <div class="bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-6 py-3">
          <div class="flex items-center gap-6">
            <h1 class="text-lg font-semibold text-gray-800">
              ChatHub | 聊天工作台
            </h1>
            <ElTabs
              modelValue={activeTab.value}
              onUpdate:modelValue={(val) => (activeTab.value = val as string)}
              class="border-none"
            >
              <ElTabPane label="聚合聊天" name="aggregated" />
              <ElTabPane label="聊天历史" name="history" />
              <ElTabPane label="智能体" name="agent" />
            </ElTabs>
          </div>
          <div class="flex items-center gap-4">
            <ElButton text circle>
              <Connection class="w-5 h-5" />
            </ElButton>
            <ElButton text circle>
              <Bell class="w-5 h-5" />
            </ElButton>
            <ElButton text circle>
              <QuestionFilled class="w-5 h-5" />
            </ElButton>
            <ElButton size="small" class="mr-2">
              小组工作台
            </ElButton>
            <ElButton type="primary" size="small" class="mr-2">
              企业控制台
            </ElButton>
            <ElDropdown>
              {{
                default: () => (
                  <span class="cursor-pointer text-gray-700 hover:text-gray-900 px-2 py-1">
                    {authStore.user?.nickname || authStore.user?.username}
                    222
                  </span>
                ),
                dropdown: () => (
                  <ElDropdownMenu>
                    <ElDropdownItem onClick={handleLogout}>
                      退出登录
                    </ElDropdownItem>
                  </ElDropdownMenu>
                ),
              }}
            </ElDropdown>
          </div>
        </div>
      </div>
    );
  },
});
