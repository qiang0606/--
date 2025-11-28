import { defineComponent, ref, computed, onMounted } from "vue";
import { useAccountStore } from "@/stores/account";
import { userApi } from "@/api/user";
import type { User } from "@/types/user";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElSelect,
  ElOption,
  ElAvatar,
} from "element-plus";

interface Props {
  modelValue: boolean;
}

export default defineComponent({
  name: "CreateFriendDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    managedAccountId: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props: Props, { emit }) {
    const accountStore = useAccountStore();
    const form = ref({
      clientUserId: "",
      remark: "",
    });
    const loading = ref(false);
    const users = ref<User[]>([]);
    const loadingUsers = ref(false);

    const canSubmit = computed(() => {
      return !!form.value.clientUserId && !!props.managedAccountId;
    });

    const selectedUser = computed(() => {
      return users.value.find((u) => u.id === form.value.clientUserId);
    });

    onMounted(async () => {
      await loadUsers();
    });

    const loadUsers = async () => {
      loadingUsers.value = true;
      try {
        users.value = await userApi.getClientUsers();
      } catch (error) {
        ElMessage.error("加载客户端用户列表失败");
      } finally {
        loadingUsers.value = false;
      }
    };

    const handleSubmit = async () => {
      if (!form.value.clientUserId) {
        ElMessage.error("请选择好友");
        return;
      }

      if (!props.managedAccountId) {
        ElMessage.error("请先选择托管账号");
        return;
      }

      loading.value = true;
      try {
        await accountStore.createFriend(
          props.managedAccountId,
          form.value.clientUserId,
          form.value.remark || undefined
        );
        ElMessage.success("添加成功");
        // 重置表单
        form.value = { clientUserId: "", remark: "" };
        emit("update:modelValue", false);
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "添加失败";
        ElMessage.error(message);
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      form.value = { clientUserId: "", remark: "" };
      emit("update:modelValue", false);
    };

    return () => (
      <ElDialog
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit("update:modelValue", val)}
        title="添加好友"
        width="500px"
        onClose={handleClose}
        v-slots={{
          footer: () => (
            <div style="text-align: right">
              <ElButton onClick={handleClose}>取消</ElButton>
              <ElButton
                type="primary"
                loading={loading.value}
                disabled={!canSubmit.value}
                onClick={handleSubmit}
              >
                添加
              </ElButton>
            </div>
          ),
        }}
      >
        <ElForm model={form.value} labelWidth="80px">
          <ElFormItem label="选择客户端用户" required>
            <ElSelect
              modelValue={form.value.clientUserId}
              onUpdate:modelValue={(val) => (form.value.clientUserId = val)}
              placeholder="请选择要添加的客户端用户"
              filterable
              loading={loadingUsers.value}
              class="w-full"
            >
              {users.value.map((user) => (
                <ElOption key={user.id} value={user.id} label={user.nickname}>
                  <div class="flex items-center gap-2">
                    <ElAvatar src={user.avatar} size={24}>
                      {user.nickname[0]}
                    </ElAvatar>
                    <div>
                      <div class="text-sm">{user.nickname}</div>
                      <div class="text-xs text-gray-500">{user.username}</div>
                    </div>
                  </div>
                </ElOption>
              ))}
            </ElSelect>
          </ElFormItem>
          {selectedUser.value && (
            <ElFormItem label="用户信息">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ElAvatar src={selectedUser.value.avatar} size={40}>
                  {selectedUser.value.nickname[0]}
                </ElAvatar>
                <div>
                  <div class="font-medium">{selectedUser.value.nickname}</div>
                  <div class="text-sm text-gray-500">
                    {selectedUser.value.username}
                  </div>
                </div>
              </div>
            </ElFormItem>
          )}
          <ElFormItem label="备注">
            <ElInput
              modelValue={form.value.remark}
              onUpdate:modelValue={(val) => (form.value.remark = val)}
              placeholder="请输入备注（可选）"
            />
          </ElFormItem>
        </ElForm>
      </ElDialog>
    );
  },
});
