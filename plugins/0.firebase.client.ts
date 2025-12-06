import { getApps, initializeApp } from "firebase/app";
import { doc, Firestore, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import type { FirebaseApp } from "firebase/app";
import { toast } from "vue3-toastify";
import { getCurrentUser } from "vuefire";

let firebaseApp: FirebaseApp;

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
        measurementId: config.public.firebaseMeasurementId,
        databaseURL: config.public.firebaseDatabaseURL,
    };

    console.log("🛠️ Firebase config:", firebaseConfig);

    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
        console.log("Firebase app initialized:", firebaseApp);
    } else {
        firebaseApp = getApps()[0];
        console.log("Reusing existing Firebase app:", firebaseApp);
    }

    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const database = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    nuxtApp.provide("firestore", firestore);
    nuxtApp.provide("firebaseAuth", auth);
    nuxtApp.provide("firebaseDatabase", database);
    nuxtApp.provide("firebaseStorage", storage);
    nuxtApp.provide("firebaseApp", firebaseApp);

    if (process.client && "serviceWorker" in navigator) {
        const supported = await isSupported();
        if (!supported) {
            console.warn("Trình duyệt không hỗ trợ FCM.");
            return;
        }

        console.log("Bắt đầu lấy FCM token");
        try {
            const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
            const messaging = getMessaging(firebaseApp);

            const vapidKey = config.public.firebaseVapidKey;
            console.log("VAPID Key:", vapidKey);

            const currentToken = await getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: registration,
            });

            if (currentToken) {
                console.log(" FCM Token:", currentToken);
            } else {
                console.warn(" Không lấy được token. Cần xin quyền.");
            }

            // Lắng nghe tin nhắn foreground
            onMessage(messaging, (payload) => {
                console.log("FCM Message received:", payload);
            });
        } catch (err) {
            console.error(" Lỗi khi xử lý Messaging:", err);
        }
    }
});

export { firebaseApp };
