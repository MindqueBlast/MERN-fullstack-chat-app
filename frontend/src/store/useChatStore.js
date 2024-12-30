import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        try {
            set({ isUsersLoading: true });
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data, isUsersLoading: false });
        } catch (error) {
            console.error('Error in getUsers:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true });
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data, isMessagesLoading: false });
        } catch (error) {
            console.error('Error in getMessages:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        const {selectedUser, messages} = get();
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
            set({ messages: [...messages, response.data] });
        } catch (error) {
            console.error('Error in sendMessage:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();

        // sourcery skip: use-braces
        if (!selectedUser) return;

        const { socket } = useAuthStore.getState();

        socket.on('newMessage', (message) => {
            if(message.senderId === selectedUser._id) {
                set({ messages: [...get().messages, message] });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const { socket } = useAuthStore.getState();
        socket.off("newMessage"); 
    }, 


    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));