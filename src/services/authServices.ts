import axiosInstance from '../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../utils/apiPaths';
import axios from 'axios';

const login = async (credentials: any) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
        return response.data;
    }
    catch (error: any) {
        throw error.response?.data || {message: "An unknown error occurred"};
    }
};

const googleLogin = async (token: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, { token });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Google login failed" };
    }
};

const register = async (username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            username,
            email,
            password,
        });
        return response.data;
    }
    catch (error: any) {
        throw error.response?.data || {message: "An unknown error occurred"};
    }
};

const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

const resetPassword = async (password: string, token: string) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.RESET_PASSWORD(token), { password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    }
    catch (error: any) {
        throw error.response?.data || {message: "An unknown error occurred"};
    }
};

const updateProfile = async (profileData: any) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, profileData);
        return response.data;
    }
    catch (error: any) {
        throw error.response?.data || {message: "An unknown error occurred"};
    }
};

/**
 * Refresh the access token using the HttpOnly refresh cookie.
 * Uses raw axios (not axiosInstance) to avoid triggering the 401 interceptor loop.
 */
const refreshToken = async (): Promise<{ accessToken: string }> => {
    try {
        const response = await axios.post(
            `${BASE_URL}${API_PATHS.AUTH.REFRESH}`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Token refresh failed" };
    }
};

/**
 * Logout: clear the refresh cookie on the server.
 */
const logout = async () => {
    try {
        await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    } catch (error: any) {
        // Even if the API call fails, we still want to clear local state
        console.error("Logout API error:", error);
    }
};

const authServices = {
    login,
    googleLogin,
    register,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    refreshToken,
    logout,
};

export { login, googleLogin, register, forgotPassword, resetPassword, getProfile, updateProfile, refreshToken, logout };
export default authServices;