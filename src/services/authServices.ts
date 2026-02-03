import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const login = async (credentials: any) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem("Token", response.data.token);
        }
        return response.data;
    }
    catch (error: any) {
        throw error.response?.data || {message: "An unknown error occurred"};
    }
};

const googleLogin = async (token: string) => {
    try {
        // Some backends expect { token: "..." }, others expect just the token string or { idToken: "..." }
        // Based on typical express-google-auth, it's usually { token } or { credential }
        const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, { token });
        if (response.data.token) {
            localStorage.setItem("Token", response.data.token);
        }
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
        if (response.data.token) {
            localStorage.setItem("Token", response.data.token);
        }
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

const authServices = {
    login,
    googleLogin,
    register,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
};

export { login, googleLogin, register, forgotPassword, resetPassword, getProfile, updateProfile };
export default authServices;