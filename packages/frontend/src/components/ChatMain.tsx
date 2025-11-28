import { defineComponent, ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import { useAccountStore } from "@/stores/account";
import { ElInput, ElButton, ElAvatar, ElEmpty } from "element-plus";
import {
  Search,
  Plus,
  Sort,
  More,
  Paperclip,
  ChatDotRound,
} from "@element-plus/icons-vue";

export default defineComponent({
  name: "ChatMain",
  setup() {
    const chatStore = useChatStore();
    const accountStore = useAccountStore();
    const messageInput = ref("");

    const currentConversationName = computed(() => {
      return chatStore.currentConversation?.name || "选择对话";
    });

    const handleSendMessage = async () => {
      if (!messageInput.value.trim() || !chatStore.currentConversation) return;
      await chatStore.sendMessage(messageInput.value);
      messageInput.value = "";
    };

    const formatTime = (time: string) => {
      const date = new Date(time);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    return () => (
      <div class="flex-1 flex flex-col bg-white h-full">
        {chatStore.currentConversation ? (
          <>
            {/* 聊天头部 */}
            <div class="px-6 py-4 border-b border-gray-200 bg-white">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-semibold text-gray-900 mb-1">
                    {currentConversationName.value}
                  </h3>
                  {accountStore.currentManagedAccount && (
                    <div class="text-xs text-gray-500">
                      来自: {accountStore.currentManagedAccount.nickname}
                    </div>
                  )}
                </div>
                <div class="flex items-center gap-2">
                  <ElButton icon={Search} circle size="small" />
                  <ElButton icon={Plus} circle size="small" />
                  <ElButton icon={Sort} circle size="small" />
                  <ElButton icon={More} circle size="small" />
                </div>
              </div>
            </div>

            {/* 消息区域 */}
            <div class="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
              {chatStore.messages.length === 0 ? (
                <div class="flex items-center justify-center h-full">
                  <ElEmpty description="暂无消息" />
                </div>
              ) : (
                <div class="space-y-4">
                  {chatStore.messages.map((msg) => (
                    <div
                      key={msg.id}
                      class={`flex gap-3 ${
                        msg.senderId === accountStore.currentManagedAccount?.id
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      <ElAvatar
                        src={msg.senderAvatar}
                        size={32}
                        class="flex-shrink-0"
                      >
                        {msg.senderName[0]}
                      </ElAvatar>
                      <div
                        class={`flex flex-col max-w-[60%] ${
                          msg.senderId ===
                          accountStore.currentManagedAccount?.id
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-xs text-gray-500">
                            {msg.senderName}
                          </span>
                          <span class="text-xs text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          class={`px-3 py-2 rounded-lg text-sm ${
                            msg.senderId ===
                            accountStore.currentManagedAccount?.id
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div class="px-6 py-4 border-t border-gray-200 bg-white">
              <div class="flex items-center gap-2 mb-2">
                <ElButton icon={Paperclip} circle size="small" />
                <ElButton icon={ChatDotRound} circle size="small" />
                <ElButton icon={More} circle size="small" />
              </div>
              <ElInput
                modelValue={messageInput.value}
                onUpdate:modelValue={(val) => (messageInput.value = val)}
                type="textarea"
                placeholder="回复 定时回复"
                rows={3}
                class="mb-2"
                onKeydown={(e: KeyboardEvent | Event) => {
                  const keyEvent = e as KeyboardEvent;
                  if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
                    keyEvent.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">"Enter"发送</span>
                <ElButton type="primary" onClick={handleSendMessage}>
                  发送
                </ElButton>
              </div>
            </div>
          </>
        ) : (
          <div class="flex items-center justify-center h-full">
            <ElEmpty description="请选择一个对话" />
          </div>
        )}
      </div>
    );
  },
});
