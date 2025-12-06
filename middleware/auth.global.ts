import { useAuth } from '../composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
    // Only run on client side
    if (process.server) {
        return;
    }

    const auth = useAuth();

    // Check if user is authenticated
    const isAuth = auth.isAuthenticated();

    // If not authenticated and trying to access protected routes
    if (!isAuth) {
        if (to.path !== "/auth/login") {
            return navigateTo("/auth/login");
        }
        return;
    }

    // If authenticated and trying to access login page
    if (to.path === "/auth/login") {
        return navigateTo("/dashboard");
    }

    // Check if user is admin
    if (!auth.isUserAdmin()) {
        console.warn("User is not admin, redirecting to login");
        auth.clearAuth();
        return navigateTo("/auth/login");
    }

    // Redirect root path to dashboard
    if (to.path === "/") {
        return navigateTo("/dashboard");
    }
});

