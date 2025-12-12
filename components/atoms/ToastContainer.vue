<script setup lang="ts">
import { useNotificationStore } from '@/composables/useNotification';

const notificationStore = useNotificationStore();

const handleRemove = (id: string) => {
  notificationStore.remove(id);
};
</script>

<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast-list">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="pointer-events-auto"
      >
        <Toast
          :id="notification.id"
          :type="notification.type"
          :message="notification.message"
          :duration="notification.duration"
          @remove="handleRemove"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-list-leave-active {
  position: absolute;
}
</style>
