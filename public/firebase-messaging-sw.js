
//pubic/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

// Khởi tạo Firebase (cùng cấu hình như app chính)
firebase.initializeApp({
  apiKey: "AIzaSyBaGaIaQv9f4R-hU2y8WzqK3aGBweRtJHA",
  authDomain: "tramxeuth.firebaseapp.com",
  projectId: "tramxeuth",
  storageBucket: "tramxeuth.firebasestorage.app",
  messagingSenderId: "929997693788",
  appId: "1:929997693788:web:2adc63b99ea604fd2f9799",
  measurementId: "G-WFJ9JFGZNP"
});

// Lấy instance của Firebase Messaging
const messaging = firebase.messaging();

// Xử lý hiển thị thông báo
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification?.title || "Thông báo";
  const notificationOptions = {
    body: payload.notification?.body || "Bạn có thông báo mới.",
    icon: "favicon.icon"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
