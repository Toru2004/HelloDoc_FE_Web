<template>
  <div>
    <img
      :src="src"
      alt="Ảnh xem trước"
      class="cursor-zoom-in w-32 h-20 object-cover border"
      @click="openViewer"
    />

    <Teleport to="body">
      <div
        v-if="show"
        class="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
        @click.self="closeViewer"
      >
        <div class="relative">
          <button
            @click="closeViewer"
            class="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black"
          >
            &times;
          </button>
          <img
            :src="src"
            class="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
            :style="{ transform: `scale(${zoom})` }"
            @wheel.prevent="handleZoom"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
}>();

const show = ref(false);
const zoom = ref(1);

function openViewer() {
  show.value = true;
  zoom.value = 1;
}
function closeViewer() {
  show.value = false;
}
function handleZoom(event: WheelEvent) {
  const delta = event.deltaY;
  const scaleStep = 0.1;
  if (delta > 0 && zoom.value > 0.5) {
    zoom.value -= scaleStep;
  } else if (delta < 0 && zoom.value < 3) {
    zoom.value += scaleStep;
  }
}
</script>

<style scoped>
/* Optional: Disable body scroll when modal is open */
body {
  overflow: hidden;
}
</style>
