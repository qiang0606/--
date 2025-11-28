import { defineComponent, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
} from "element-plus";

interface Props {
  modelValue: boolean;
}

export default defineComponent({
  name: "CreateAccountDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props: Props, { emit }) {
    const accountStore = useAccountStore();
    const form = ref({
      username: "",
      nickname: "",
      avatar: "",
    });
    const loading = ref(false);

    const handleSubmit = async () => {
      if (!form.value.username || !form.value.nickname) {
        ElMessage.error("请填写用户名和昵称");
        return;
      }

      loading.value = true;
      try {
        await accountStore.createManagedAccount(
          form.value.username,
          form.value.nickname,
          form.value.avatar || undefined
        );
        ElMessage.success("创建成功");
        // 重置表单
        form.value = { username: "", nickname: "", avatar: "" };
        emit("update:modelValue", false);
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "创建失败";
        ElMessage.error(message);
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      form.value = { username: "", nickname: "", avatar: "" };
      emit("update:modelValue", false);
    };

    return () => (
      <ElDialog
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit("update:modelValue", val)}
        title="创建托管账号"
        width="500px"
        onClose={handleClose}
        v-slots={{
          footer: () => (
            <div style="text-align: right">
              <ElButton onClick={handleClose}>取消</ElButton>
              <ElButton
                type="primary"
                loading={loading.value}
                onClick={handleSubmit}
              >
                创建
              </ElButton>
            </div>
          ),
        }}
      >
        <ElForm model={form.value} labelWidth="80px">
          <ElFormItem label="用户名" required>
            <ElInput
              modelValue={form.value.username}
              onUpdate:modelValue={(val) => (form.value.username = val)}
              placeholder="请输入用户名"
            />
          </ElFormItem>
          <ElFormItem label="昵称" required>
            <ElInput
              modelValue={form.value.nickname}
              onUpdate:modelValue={(val) => (form.value.nickname = val)}
              placeholder="请输入昵称"
            />
          </ElFormItem>
          <ElFormItem label="头像">
            <ElInput
              modelValue={form.value.avatar}
              onUpdate:modelValue={(val) => (form.value.avatar = val)}
              placeholder="请输入头像URL（可选）"
            />
          </ElFormItem>
        </ElForm>
      </ElDialog>
    );
  },
});
