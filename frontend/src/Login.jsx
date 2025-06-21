import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './userSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';  

export default function Login() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email });
      const user = res.data.user;

      dispatch(loginSuccess(user)); // ✅ user gets saved in Redux
      navigate('/dashboard');       // ✅ App.jsx handles socket registration
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
