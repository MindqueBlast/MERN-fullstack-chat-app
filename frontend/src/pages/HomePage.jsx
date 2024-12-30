import React from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import DefaultChat from '../components/DefaultChat';

const HomePage = () => {
  const { selectedUser, messages, isMessagesLoading, getUsers, getMessages } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatWindow /> : <DefaultChat />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;