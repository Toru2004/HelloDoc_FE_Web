import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
    state: () => ({
        notifications: [] as { title?: string; body?: string }[],
    }),
    actions: {
        addNotification(n: { title?: string; body?: string }) {
            this.notifications.push(n);
        },
        removeNotification(index: number) {
            this.notifications.splice(index, 1);
        }
    },
});
