import { defineComponent } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElAvatar,
} from "element-plus";

export default defineComponent({
  name: "ChatHeader",
  setup() {
    const authStore = useAuthStore();
    const chatStore = useChatStore();
    const router = useRouter();

    const handleLogout = () => {
      authStore.logout();
      chatStore.clearChatState();
      router.push("/login");
    };

    return () => (
      <div class="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-800">ChatHub</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">
              {authStore.user?.nickname || authStore.user?.username}
            </span>
            <ElDropdown>
              {{
                default: () => (
                  <ElAvatar
                    src={authStore.user?.avatar}
                    size={32}
                    class="cursor-pointer"
                  >
                    {authStore.user?.nickname?.[0] ||
                      authStore.user?.username?.[0]}
                  </ElAvatar>
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
