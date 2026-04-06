import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL, API_PATHS } from './apiPaths';

// ─── In-Memory Access Token Store ───────────────────────────────────
// Never stored in localStorage — only lives in JS memory.
// On page refresh, AuthContext calls /refresh to get a new one.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

// ─── Axios Instance ─────────────────────────────────────────────────
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Send cookies (refresh token) on every request
});

// ─── Request Interceptor ────────────────────────────────────────────
// Attach the in-memory access token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ─── Response Interceptor: Silent Token Refresh ─────────────────────
// When a 401 is received, attempt to refresh the token once, then retry.
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            resolve(axiosInstance(config));
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Only attempt refresh on 401 errors, not on the refresh endpoint itself
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes(API_PATHS.AUTH.REFRESH) &&
            !originalRequest.url?.includes(API_PATHS.AUTH.LOGIN) &&
            !originalRequest.url?.includes(API_PATHS.AUTH.REGISTER)
        ) {
            if (isRefreshing) {
                // Another refresh is in progress — queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint — cookie is sent automatically
                const { data } = await axios.post(
                    `${BASE_URL}${API_PATHS.AUTH.REFRESH}`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = data.accessToken;
                setAccessToken(newAccessToken);

                // Retry the original request with new token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                // Process queued requests
                processQueue(null, newAccessToken);

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed — clear token and reject all queued requests
                setAccessToken(null);
                processQueue(refreshError as AxiosError);

                // Dispatch a custom event so AuthContext can handle logout
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Non-401 errors
        if (error.response) {
            if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("Request timeout. Please try again.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;