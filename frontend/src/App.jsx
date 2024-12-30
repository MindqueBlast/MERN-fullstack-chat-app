import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage'; 
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if(isCheckingAuth && !authUser) {
    return (
      <div className = "flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin'></Loader>
      </div>
    );
  }

  return (
    <div data-theme = {theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage />: <Navigate to="/signup"/>} />
        <Route path="/signup" element={authUser ? <Navigate to="/"/> : <SignUpPage />} />
        <Route path="/login" element={authUser ? <Navigate to="/"/> : <LoginPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/signup"/>} />
        <Route path = "/settings" element = {authUser ? <SettingsPage />: <Navigate to="/signup"/>} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;