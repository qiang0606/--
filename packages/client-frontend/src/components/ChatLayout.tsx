import { defineComponent } from "vue";
import ChatSidebar from "./ChatSidebar.tsx";
import ChatMain from "./ChatMain.tsx";
import ChatHeader from "./ChatHeader.tsx";

export default defineComponent({
  name: "ChatLayout",
  setup() {
    return () => (
      <div class="h-screen flex flex-col bg-gray-50">
        <ChatHeader />
        <div class="flex-1 flex overflow-hidden">
          <ChatSidebar />
          <ChatMain />
        </div>
      </div>
    );
  },
});
