 
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './userSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';  

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    referralCode: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      dispatch(loginSuccess(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="referralCode"
        placeholder="Referral Code (optional)"
        value={form.referralCode}
        onChange={handleChange}
      />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}
