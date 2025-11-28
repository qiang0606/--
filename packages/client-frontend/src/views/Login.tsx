import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({
      username: "",
      password: "",
    });
    const loading = ref(false);

    const handleLogin = async () => {
      if (!form.value.username || !form.value.password) {
        ElMessage.error("请填写用户名和密码");
        return;
      }

      loading.value = true;
      try {
        await authStore.login(form.value.username, form.value.password);
        ElMessage.success("登录成功");
        router.push("/");
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "登录失败";
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
              <p class="text-gray-600">欢迎回来</p>
            </div>
            <ElForm model={form.value}>
              <ElFormItem>
                <ElInput
                  modelValue={form.value.username}
                  onUpdate:modelValue={(val) => (form.value.username = val)}
                  placeholder="用户名"
                  size="large"
                  class="h-12"
                />
              </ElFormItem>
              <ElFormItem>
                <ElInput
                  modelValue={form.value.password}
                  onUpdate:modelValue={(val) => (form.value.password = val)}
                  type="password"
                  placeholder="密码"
                  size="large"
                  class="h-12"
                  onKeydown={(e: KeyboardEvent | Event) => {
                    const keyEvent = e as KeyboardEvent;
                    if (keyEvent.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </ElFormItem>
              <ElFormItem>
                <ElButton
                  type="primary"
                  loading={loading.value}
                  onClick={handleLogin}
                  class="w-full h-12 text-base font-medium"
                >
                  登录
                </ElButton>
              </ElFormItem>
              <ElFormItem>
                <div class="text-center w-full">
                  <span class="text-gray-500">还没有账号？</span>
                  <ElButton
                    type="text"
                    onClick={() => router.push("/register")}
                  >
                    立即注册
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
