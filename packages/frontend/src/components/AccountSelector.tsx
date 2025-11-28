import { defineComponent, onMounted, ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { ElCard, ElButton, ElAvatar, ElEmpty } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import CreateAccountDialog from './CreateAccountDialog.tsx'

export default defineComponent({
  name: 'AccountSelector',
  setup() {
    const accountStore = useAccountStore()
    const showCreateDialog = ref(false)

    onMounted(async () => {
      await accountStore.fetchManagedAccounts()
    })

    const handleSelectAccount = async (accountId: string) => {
      await accountStore.selectManagedAccount(accountId)
    }

    const handleCreateSuccess = async () => {
      await accountStore.fetchManagedAccounts()
    }

    return () => (
      <div class="w-full max-w-4xl">
        <ElCard class="shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">选择托管账号</h2>
            <ElButton type="primary" icon={Plus} onClick={() => (showCreateDialog.value = true)}>
              创建账号
            </ElButton>
          </div>
          {accountStore.managedAccounts.length === 0 ? (
            <ElEmpty description="暂无可用账号">
              <ElButton type="primary" icon={Plus} onClick={() => (showCreateDialog.value = true)}>
                创建第一个账号
              </ElButton>
            </ElEmpty>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountStore.managedAccounts.map((account) => (
                <div
                  key={account.id}
                  class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleSelectAccount(account.id)}
                >
                  <div class="flex items-center gap-4">
                    <ElAvatar src={account.avatar} size={50} class="flex-shrink-0">
                      {account.nickname[0]}
                    </ElAvatar>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-gray-900 truncate">{account.nickname}</div>
                      <div class="text-sm text-gray-500 truncate">{account.username}</div>
                      <div
                        class={`text-xs mt-1 ${
                          account.status === 'online' ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {account.status === 'online' ? '在线' : '离线'}
                      </div>
                    </div>
                    <ElButton type="primary" size="small">选择</ElButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ElCard>
        <CreateAccountDialog
          modelValue={showCreateDialog.value}
          onUpdate:modelValue={(val) => {
            showCreateDialog.value = val
            if (!val) {
              handleCreateSuccess()
            }
          }}
        />
      </div>
    )
  },
})
