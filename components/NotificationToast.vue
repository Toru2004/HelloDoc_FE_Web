<template>
  <div v-if="formattedNotifications.length" class="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div
      v-for="(n, index) in formattedNotifications"
      :key="index"
      class="max-w-md w-full bg-pink-400 text-white rounded-lg shadow-lg p-6 space-y-3"
      style="word-break: break-word;"
    >
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 text-2xl">ℹ️</div>
        <strong class="text-xl font-semibold">{{ n.title }}</strong>
      </div>

      <div class="text-sm whitespace-pre-line">
        <div v-for="(line, i) in n.lines" :key="i">{{ line }}</div>
      </div>
      <div class="flex justify-center space-x-6">
  <button
    @click="rejectNotification(n,index)"
    class="px-4 py-2 border border-white bg-transparent rounded
           hover:bg-red-500 hover:text-white transition-colors duration-300 font-bold text-white"
  >
    Từ chối
  </button>
  <button
    @click="acceptNotification(n,index)"
    class="px-4 py-2 border border-white bg-transparent rounded
           hover:bg-green-500 hover:text-white transition-colors duration-300 font-bold text-white"
  >
    Chấp nhận
  </button>
</div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";
import { computed } from "vue";
import { saveRequestFireBase,editStatus } from "@/stores/creatRequest";
import { toast } from "vue3-toastify";
const store = useNotificationsStore();
const { notifications } = storeToRefs(store);

function formatBody(body: string) {
  if (!body) return [];
  try {
    const json = JSON.parse(body);
    if (typeof json === "object" && json !== null) {
      const entries = Object.entries(json) as [string, any][];
      return entries.map(([k, v]) => `${k.toUpperCase()}: ${v}`);
    }
  } catch {
    // Không phải JSON, tách theo dấu phẩy
  }
  return body.split(",").map(s => s.trim());
}

const formattedNotifications = computed(() => {
  return notifications.value.map(n => {
    return {
      title: n.title,
      lines: formatBody(n.body || ""),
    };
  });
});
async function acceptNotification(n: { lines: string[] }, index: number) {
  const dataObj: Record<string, string> = {};
  n.lines.forEach(line => {
    const [key, ...rest] = line.split(":");
    dataObj[key.trim()] = rest.join(":").trim();
  });

  const start = new Date(dataObj["THOIGIAN_BATDAU"]);
  const end = new Date(dataObj["THOIGIAN_KETTHUC"]);
  const diffMs = end.getTime() - start.getTime();
  const timer = Math.floor(diffMs / (1000 * 60 * 60));

  await saveRequestFireBase(n.lines, true);
  await editStatus(true, String(timer));
  showSuccess();

  store.removeNotification(index); // Xóa sau khi xử lý
}

async function rejectNotification(n: { lines: string[] }, index: number) {
  await saveRequestFireBase(n.lines, false);
  store.removeNotification(index); // Xóa sau khi xử lý
  showDeny();
}
function showSuccess() {
  toast.success("Phê duyệt thành công!", {
    autoClose: 2000, 
  });
}
function showDeny(){
  toast.warn("Từ chối phê duyệt!",{
    autoClose:2000,
});
}
</script>
