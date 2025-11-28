import { defineStore } from "pinia";
import { ref } from "vue";
import type { Conversation, Message } from "@/types/chat";
import { chatApi } from "@/api/chat";
import { socketService } from "@/services/socket";

export const useChatStore = defineStore("chat", () => {
  const conversations = ref<Conversation[]>([]);
  const currentConversation = ref<Conversation | null>(null);
  const messages = ref<Message[]>([]);
  const unreadCount = ref(0);

  // 获取对话列表
  const fetchConversations = async () => {
    const list = await chatApi.getConversations();
    conversations.value = list;
    return list;
  };

  // 选择对话
  const selectConversation = async (conversationId: string) => {
    const conversation = conversations.value.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      currentConversation.value = conversation;
      await fetchMessages(conversationId);
      // 标记为已读
      await markAsRead(conversationId);
    }
  };

  // 获取消息列表
  const fetchMessages = async (conversationId: string) => {
    const messageList = await chatApi.getMessages(conversationId);
    messages.value = messageList;
    return messageList;
  };

  // 发送消息
  const sendMessage = async (content: string, conversationId?: string) => {
    const targetId = conversationId || currentConversation.value?.id;
    if (!targetId) return;

    const message = await chatApi.sendMessage({
      conversationId: targetId,
      content,
    });
    messages.value.push(message);
    return message;
  };

  // 接收消息（通过 WebSocket）
  const receiveMessage = (message: Message) => {
    // 如果消息属于当前对话，添加到消息列表
    if (message.conversationId === currentConversation.value?.id) {
      messages.value.push(message);
    } else {
      // 如果不在当前对话，增加未读数并更新对话列表
      unreadCount.value++;
      const conversation = conversations.value.find(
        (c) => c.id === message.conversationId
      );
      if (conversation) {
        conversation.lastMessage = message.content;
        conversation.lastMessageTime =
          message.timestamp || new Date().toISOString();
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    }
  };

  // 清除聊天状态
  const clearChatState = () => {
    conversations.value = [];
    currentConversation.value = null;
    messages.value = [];
    unreadCount.value = 0;
  };

  // 标记为已读
  const markAsRead = async (conversationId: string) => {
    await chatApi.markAsRead(conversationId);
    const conversation = conversations.value.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      conversation.unreadCount = 0;
    }
  };

  // 初始化 WebSocket 监听
  const initSocketListeners = () => {
    socketService.onMessage((message: Message) => {
      receiveMessage(message);
    });
  };

  return {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    fetchConversations,
    selectConversation,
    fetchMessages,
    sendMessage,
    receiveMessage,
    markAsRead,
    initSocketListeners,
    clearChatState,
  };
});
