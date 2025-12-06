import type { JWTPayload } from '../utils/jwt';
import { isTokenExpired } from '../utils/jwt';

/**
 * Composable for managing authentication state
 */
export const useAuth = () => {
    const TOKEN_KEY = 'auth_token';
    const USER_KEY = 'user_info';

    /**
     * Save authentication data to localStorage
     */
    const saveAuth = (token: string, userInfo: JWTPayload) => {
        if (process.client) {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
        }
    };

    /**
     * Get authentication token from localStorage
     */
    const getToken = (): string | null => {
        if (process.client) {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    };

    /**
     * Get user info from localStorage
     */
    const getUserInfo = (): JWTPayload | null => {
        if (process.client) {
            const userStr = localStorage.getItem(USER_KEY);
            if (userStr) {
                try {
                    return JSON.parse(userStr) as JWTPayload;
                } catch (error) {
                    console.error('Error parsing user info:', error);
                    return null;
                }
            }
        }
        return null;
    };

    /**
     * Clear authentication data from localStorage
     */
    const clearAuth = () => {
        if (process.client) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = (): boolean => {
        const token = getToken();
        if (!token) {
            return false;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
            clearAuth();
            return false;
        }

        return true;
    };

    /**
     * Check if current user is admin
     */
    const isUserAdmin = (): boolean => {
        const userInfo = getUserInfo();
        return userInfo?.role?.toLowerCase() === 'admin';
    };

    return {
        saveAuth,
        getToken,
        getUserInfo,
        clearAuth,
        isAuthenticated,
        isUserAdmin,
    };
};

