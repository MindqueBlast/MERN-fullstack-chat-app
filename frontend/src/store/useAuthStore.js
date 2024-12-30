import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// Ensure axios sends cookies with each request
axiosInstance.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        console.log("Calling /auth/check");
        try {
            const res = await axiosInstance.get('/auth/check');
            console.log("Auth Check Response:", res.data);
            set({ authUser: res.data, isCheckingAuth: false });
            get().connectSocket();
        } catch (error) {
            console.error("Auth Check Error:", error.response || error.message);
            set({ authUser: null, isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        try {
            set({ isSigningUp: true });
            const response = await axiosInstance.post('/auth/signup', data);
            set({ authUser: response.data, isSigningUp: false });
            toast.success('Signed up successfully');
            get().connectSocket();
        } 
        catch (error) {
            console.error("Error in signup:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const response = await axiosInstance.post('/auth/login', data);
            set({ authUser: response.data, isLoggingIn: false });
            toast.success('Logged in successfully');
            get().connectSocket();
        } catch (error) {
            console.error("Error in login:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: response.data, isUpdatingProfile: false });
            toast.success('Profile updated successfully');
        } 
        catch (error) {
            console.error("Error in updateProfile:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
            set({ isUpdatingProfile: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout'); 
            set({ authUser: null });
            toast.success('Logged out successfully');
            get().disconnectSocket();
        } catch (error) {
            console.error("Error in logout:", error.response || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            return;
        }

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}));