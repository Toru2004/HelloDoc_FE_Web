import { getMessaging, onMessage } from "firebase/messaging";
import { useNotificationsStore } from "../stores/notifications"; // nếu dùng Pinia/Vuex
import type { FirebaseApp } from "firebase/app";

export default defineNuxtPlugin(() => {
    if (typeof window !== "undefined") {
        const nuxtApp = useNuxtApp();
        const firebaseApp = nuxtApp.$firebaseApp as FirebaseApp;

        if (!firebaseApp) {
            console.error("❌ Firebase chưa được khởi tạo trước khi FCM chạy");
            return;
        }
        const messaging = getMessaging(firebaseApp);
        onMessage(messaging, (payload) => {
            console.log("📩 Foreground message:", payload);
            // Ví dụ: cập nhật store để hiển thị UI
            const store = useNotificationsStore();
            store.addNotification({
                title: payload.notification?.title,
                body: payload.notification?.body,
            });
        });
    }
});
