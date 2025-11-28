import { defineComponent, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { ElTabs, ElTabPane, ElInput, ElEmpty, ElCheckbox, ElButton } from 'element-plus'

export default defineComponent({
  name: 'ChatRightPanel',
  setup() {
    const chatStore = useChatStore()
    const activeTab = ref('workstation')
    const isRead = ref(true)
    const materialSearch = ref('')

    const handleEndConversation = () => {
      // 结束对话逻辑
      console.log('End conversation')
    }

    return () => (
      <div class="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <ElCheckbox modelValue={isRead.value} onUpdate:modelValue={(val) => (isRead.value = val)}>
            标记为已读
          </ElCheckbox>
          <ElButton type="danger" size="small" onClick={handleEndConversation}>
            结束对话
          </ElButton>
        </div>
        <ElTabs modelValue={activeTab.value} onUpdate:modelValue={(val) => (activeTab.value = val)} class="flex-1 flex flex-col">
          <ElTabPane label="工作台" name="workstation">
            <div class="p-4">
              <ElInput
                modelValue={materialSearch.value}
                onUpdate:modelValue={(val) => (materialSearch.value = val)}
                placeholder="Q 请输入素材标题"
                clearable
                size="small"
                class="mb-4"
              />
              <div class="flex gap-2 mb-4">
                <button class="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600">企业素材</button>
                <button class="px-3 py-1 text-xs rounded text-gray-600 hover:bg-gray-100">小组素材</button>
                <button class="px-3 py-1 text-xs rounded text-gray-600 hover:bg-gray-100">个人素材</button>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-2 text-sm text-gray-700">
                  <span>📁</span>
                  <span>默认分组</span>
                </div>
                <ElEmpty description="暂无素材" />
              </div>
            </div>
          </ElTabPane>
          <ElTabPane label="客户跟进" name="followup">
            <div class="p-4">
              <ElEmpty description="客户跟进" />
            </div>
          </ElTabPane>
          <ElTabPane label="会话小结" name="summary">
            <div class="p-4">
              <ElEmpty description="会话小结" />
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    )
  },
})
