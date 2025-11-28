import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElCard,
  ElMessage,
  ElDivider,
} from "element-plus";
import { Delete, Plus } from "@element-plus/icons-vue";

export default defineComponent({
  name: "Register",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    // const accountStore = useAccountStore();
    const form = ref({
      username: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      email: "",
      phone: "",
    });
    const friends = ref<
      Array<{ nickname: string; remark: string; avatar: string }>
    >([]);
    const loading = ref(false);

    const addFriend = () => {
      friends.value.push({ nickname: "", remark: "", avatar: "" });
    };

    const removeFriend = (index: number) => {
      friends.value.splice(index, 1);
    };

    const handleRegister = async () => {
      if (
        !form.value.username ||
        !form.value.password ||
        !form.value.nickname
      ) {
        ElMessage.error("请填写必填项");
        return;
      }

      if (form.value.password.length < 6) {
        ElMessage.error("密码至少6位");
        return;
      }

      if (form.value.password !== form.value.confirmPassword) {
        ElMessage.error("两次密码输入不一致");
        return;
      }

      loading.value = true;
      try {
        await authStore.register({
          username: form.value.username,
          password: form.value.password,
          nickname: form.value.nickname,
          email: form.value.email || undefined,
          phone: form.value.phone || undefined,
        });
        ElMessage.success("注册成功");
        router.push("/");
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "注册失败";
        ElMessage.error(message);
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <ElCard class="w-full max-w-2xl shadow-xl">
          <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
            ChatHub 注册
          </h2>
          <ElForm model={form.value} labelWidth="100px">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ElFormItem label="密码" required>
                <ElInput
                  modelValue={form.value.password}
                  onUpdate:modelValue={(val) => (form.value.password = val)}
                  type="password"
                  placeholder="请输入密码（至少6位）"
                />
              </ElFormItem>
              <ElFormItem label="确认密码" required>
                <ElInput
                  modelValue={form.value.confirmPassword}
                  onUpdate:modelValue={(val) =>
                    (form.value.confirmPassword = val)
                  }
                  type="password"
                  placeholder="请再次输入密码"
                  onKeydown={(e: KeyboardEvent | Event) => {
                    const keyEvent = e as KeyboardEvent;
                    if (keyEvent.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </ElFormItem>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ElFormItem label="邮箱">
                <ElInput
                  modelValue={form.value.email}
                  onUpdate:modelValue={(val) => (form.value.email = val)}
                  placeholder="请输入邮箱（可选）"
                />
              </ElFormItem>
              <ElFormItem label="手机号">
                <ElInput
                  modelValue={form.value.phone}
                  onUpdate:modelValue={(val) => (form.value.phone = val)}
                  placeholder="请输入手机号（可选）"
                />
              </ElFormItem>
            </div>

            <ElDivider>添加好友（可选）</ElDivider>

            <div class="space-y-3 mb-4">
              {friends.value.map((friend, index) => (
                <div
                  key={index}
                  class="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <ElInput
                      modelValue={friend.nickname}
                      onUpdate:modelValue={(val) => (friend.nickname = val)}
                      placeholder="好友昵称"
                      size="small"
                    />
                    <ElInput
                      modelValue={friend.remark}
                      onUpdate:modelValue={(val) => (friend.remark = val)}
                      placeholder="备注（可选）"
                      size="small"
                    />
                    <ElInput
                      modelValue={friend.avatar}
                      onUpdate:modelValue={(val) => (friend.avatar = val)}
                      placeholder="头像URL（可选）"
                      size="small"
                    />
                  </div>
                  <ElButton
                    icon={Delete}
                    circle
                    size="small"
                    onClick={() => removeFriend(index)}
                  />
                </div>
              ))}
              <ElButton
                icon={Plus}
                onClick={addFriend}
                class="w-full"
                size="small"
              >
                添加好友
              </ElButton>
            </div>

            <ElFormItem>
              <ElButton
                type="primary"
                loading={loading.value}
                onClick={handleRegister}
                class="w-full"
              >
                注册
              </ElButton>
            </ElFormItem>
            <ElFormItem>
              <div class="text-center w-full">
                <span class="text-gray-500">已有账号？</span>
                <ElButton type="text" onClick={() => router.push("/login")}>
                  去登录
                </ElButton>
              </div>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </div>
    );
  },
});
