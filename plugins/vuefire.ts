import { firebaseApp } from "./0.firebase.client";
import { VueFire, VueFireAuth } from "vuefire";

export default defineNuxtPlugin((nuxtApp) => {
    if (!firebaseApp) {
        throw new Error("Firebase app was not initialized.");
    }

    nuxtApp.vueApp.use(VueFire, {
        firebaseApp: firebaseApp,
        modules: [VueFireAuth()],
    });
});
