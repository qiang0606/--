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
} from "element-plus";

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
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <ElCard class="w-full max-w-md shadow-xl">
          <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
            ChatHub 登录
          </h2>
          <ElForm model={form.value}>
            <ElFormItem label="用户名">
              <ElInput
                modelValue={form.value.username}
                onUpdate:modelValue={(val) => (form.value.username = val)}
                placeholder="请输入用户名"
              />
            </ElFormItem>
            <ElFormItem label="密码">
              <ElInput
                modelValue={form.value.password}
                onUpdate:modelValue={(val) => (form.value.password = val)}
                type="password"
                placeholder="请输入密码"
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
                class="w-full"
              >
                登录
              </ElButton>
            </ElFormItem>
            <ElFormItem>
              <div class="text-center w-full">
                <span class="text-gray-500">还没有账号？</span>
                <ElButton type="text" onClick={() => router.push("/register")}>
                  去注册
                </ElButton>
              </div>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </div>
    );
  },
});
