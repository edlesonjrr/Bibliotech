
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import MainLayout from './MainLayout';
import { useLibrary } from '../context/LibraryContext';

const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useLibrary();

  if (currentUser) {
    return <MainLayout />;
  }

  return isLogin ? (
    <Login onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setIsLogin(true)} />
  );
};

export default AuthLayout;
