// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ProductPage from './Products';
import Navbar from './Navbar';
import socket from './socket'; // ✅ socket instance

export default function App() {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?._id) return;

     
    if (!socket.connected) {
      socket.connect();
    }

    const registerUser = () => {
      console.log('📡 Registering user on socket:', user._id);
      socket.emit('register', user._id);
    };

     
    socket.on('connect', registerUser);

   
    if (socket.connected) {
       console.log('register called');
      registerUser();
    }

    return () => {
      socket.off('connect', registerUser); // ✅ clean up listener
    };
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/products" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
