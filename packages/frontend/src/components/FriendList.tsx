import { defineComponent, onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useChatStore } from "@/stores/chat";
import { ElAvatar, ElBadge, ElEmpty, ElButton } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { chatApi } from "@/api/chat";
import CreateFriendDialog from "./CreateFriendDialog.tsx";

export default defineComponent({
  name: "FriendList",
  setup() {
    const accountStore = useAccountStore();
    const chatStore = useChatStore();
    const showCreateDialog = ref(false);

    onMounted(async () => {
      if (accountStore.currentManagedAccount?.id) {
        await accountStore.fetchFriends(accountStore.currentManagedAccount.id);
      }
    });

    const handleSelectFriend = async (friendId: string) => {
      // friendId 是 UserFriend 的 ID，需要创建对话
      // 对话的参与者应该是 friendUserId
      const conversation = await chatApi.createConversation(
        friendId,
        accountStore.currentManagedAccount?.id
      );
      // 选择对话
      await chatStore.selectConversation(conversation.id);
    };

    const handleCreateSuccess = async () => {
      if (accountStore.currentManagedAccount?.id) {
        await accountStore.fetchFriends(accountStore.currentManagedAccount.id);
      }
    };

    return () => (
      <div class="flex-1 flex flex-col bg-white border-r border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900">好友列表</h3>
            <ElButton
              type="primary"
              icon={Plus}
              size="small"
              onClick={() => (showCreateDialog.value = true)}
            >
              添加好友
            </ElButton>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          {accountStore.friends.length === 0 ? (
            <div class="flex items-center justify-center h-full">
              <ElEmpty description="暂无好友">
                <ElButton
                  type="primary"
                  icon={Plus}
                  onClick={() => (showCreateDialog.value = true)}
                >
                  添加第一个好友
                </ElButton>
              </ElEmpty>
            </div>
          ) : (
            <div class="space-y-2">
              {accountStore.friends.map((friend) => (
                <div
                  key={friend.id}
                  class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectFriend(friend.id)}
                >
                  <ElBadge
                    value={friend.unreadCount}
                    hidden={!friend.unreadCount}
                  >
                    <ElAvatar
                      src={friend.avatar}
                      size={40}
                      class="flex-shrink-0"
                    >
                      {friend.nickname[0]}
                    </ElAvatar>
                  </ElBadge>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 truncate">
                      {friend.remark || friend.nickname}
                    </div>
                    <div class="text-sm text-gray-500 truncate">
                      {friend.lastMessage || ""}
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                    <span
                      class={`w-2 h-2 rounded-full inline-block ${
                        friend.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <CreateFriendDialog
          modelValue={showCreateDialog.value}
          managedAccountId={accountStore.currentManagedAccount?.id || ''}
          onUpdate:modelValue={(val) => {
            showCreateDialog.value = val;
            if (!val) {
              handleCreateSuccess();
            }
          }}
        />
      </div>
    );
  },
});
