import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default defineNuxtPlugin(() => {
    if (process.client) {
        const firebaseConfig = {
            apiKey: "AIzaSyBaGaIaQv9f4R-hU2y8WzqK3aGBweRtJHA",
            authDomain: "tramxeuth.firebaseapp.com",
            projectId: "tramxeuth",
            storageBucket: "tramxeuth.firebasestorage.app",
            messagingSenderId: "929997693788",
            appId: "1:929997693788:web:2adc63b99ea604fd2f9799",
            measurementId: "G-WFJ9JFGZNP"
        };

        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        // Đăng ký service worker
        navigator.serviceWorker.register("/firebase-messaging-sw.js").then(registration => {
            console.log("✅ Service Worker đã đăng ký:", registration);

            // Lấy token FCM bằng vapidKey từ runtimeConfig
            getToken(messaging, {
                vapidKey: config.public.firebaseVapidKey,
                serviceWorkerRegistration: registration
            })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log(" FCM Token:", currentToken);
                        // TODO: Gửi token này lên server Python
                    } else {
                        console.warn(" Không lấy được token");
                    }
                })
                .catch((err) => {
                    console.error(" Lỗi khi lấy token:", err);
                });

            // Lắng nghe thông báo khi web đang mở
            onMessage(messaging, (payload) => {
                console.log(" Nhận thông báo foreground:", payload);
            });
        });
    }
});
