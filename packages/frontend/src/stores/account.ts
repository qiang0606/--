import { defineStore } from "pinia";
import { ref } from "vue";
import type { ManagedAccount, Friend } from "@/types/account";
import { accountApi } from "@/api/account";

export const useAccountStore = defineStore("account", () => {
  const managedAccounts = ref<ManagedAccount[]>([]);
  const currentManagedAccount = ref<ManagedAccount | null>(null);
  const friends = ref<Friend[]>([]);

  // 获取可托管的账号列表
  const fetchManagedAccounts = async () => {
    const accounts = await accountApi.getManagedAccounts();
    managedAccounts.value = accounts;
    return accounts;
  };

  // 选择托管账号
  const selectManagedAccount = async (accountId: string) => {
    const account = managedAccounts.value.find((a) => a.id === accountId);
    if (account) {
      currentManagedAccount.value = account;
      // 获取托管账号的好友列表
      await fetchFriends(accountId);
    }
  };

  // 获取托管账号的好友列表
  const fetchFriends = async (managedAccountId: string) => {
    const friendList = await accountApi.getFriends(managedAccountId);
    friends.value = friendList;
    return friendList;
  };

  // 创建托管账号
  const createManagedAccount = async (
    username: string,
    nickname: string,
    avatar?: string
  ) => {
    const account = await accountApi.createManagedAccount({
      username,
      nickname,
      avatar,
    });
    managedAccounts.value.push(account);
    return account;
  };

  // 创建好友
  const createFriend = async (managedAccountId: string, clientUserId: string, remark?: string) => {
    const friend = await accountApi.createFriend(managedAccountId, { clientUserId, remark });
    friends.value.push(friend);
    return friend;
  };

  // 清除当前托管账号
  const clearManagedAccount = () => {
    currentManagedAccount.value = null;
    friends.value = [];
  };

  return {
    managedAccounts,
    currentManagedAccount,
    friends,
    fetchManagedAccounts,
    selectManagedAccount,
    fetchFriends,
    createManagedAccount,
    createFriend,
    clearManagedAccount,
  };
});
