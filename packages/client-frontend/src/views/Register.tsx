import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";

export default defineComponent({
  name: "Register",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({
      username: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      email: "",
      phone: "",
    });
    const loading = ref(false);

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
      <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <div class="bg-white rounded-2xl shadow-2xl p-8">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">ChatHub</h1>
              <p class="text-gray-600">创建新账号</p>
            </div>
            <ElForm model={form.value} labelWidth="80px">
              <div class="grid grid-cols-1 gap-4">
                <ElFormItem label="用户名" required>
                  <ElInput
                    modelValue={form.value.username}
                    onUpdate:modelValue={(val) => (form.value.username = val)}
                    placeholder="请输入用户名"
                    size="large"
                  />
                </ElFormItem>
                <ElFormItem label="昵称" required>
                  <ElInput
                    modelValue={form.value.nickname}
                    onUpdate:modelValue={(val) => (form.value.nickname = val)}
                    placeholder="请输入昵称"
                    size="large"
                  />
                </ElFormItem>
                <ElFormItem label="密码" required>
                  <ElInput
                    modelValue={form.value.password}
                    onUpdate:modelValue={(val) => (form.value.password = val)}
                    type="password"
                    placeholder="请输入密码（至少6位）"
                    size="large"
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
                    size="large"
                    onKeydown={(e: KeyboardEvent | Event) => {
                      const keyEvent = e as KeyboardEvent;
                      if (keyEvent.key === "Enter") {
                        handleRegister();
                      }
                    }}
                  />
                </ElFormItem>
                <ElFormItem label="邮箱">
                  <ElInput
                    modelValue={form.value.email}
                    onUpdate:modelValue={(val) => (form.value.email = val)}
                    placeholder="请输入邮箱（可选）"
                    size="large"
                  />
                </ElFormItem>
                <ElFormItem label="手机号">
                  <ElInput
                    modelValue={form.value.phone}
                    onUpdate:modelValue={(val) => (form.value.phone = val)}
                    placeholder="请输入手机号（可选）"
                    size="large"
                  />
                </ElFormItem>
              </div>
              <ElFormItem>
                <ElButton
                  type="primary"
                  loading={loading.value}
                  onClick={handleRegister}
                  class="w-full h-12 text-base font-medium"
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
          </div>
        </div>
      </div>
    );
  },
});
