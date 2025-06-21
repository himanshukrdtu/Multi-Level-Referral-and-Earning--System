 
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setEarnings } from './userSlice';
import socket from './socket';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

import './Dashboard.css';

export default function Dashboard() {
  const { isLoggedIn, user, earnings } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recentNotifications, setRecentNotifications] = useState([]);
  const [oldNotifications, setOldNotifications] = useState([]);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }

    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`https://multi-level-referral-and-earning-system-geln.onrender.com/api/earnings/${user._id}`);
        dispatch(setEarnings(res.data));
      } catch (err) {
        console.error('Error fetching earnings:', err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`https://multi-level-referral-and-earning-system-geln.onrender.com/api/notifications/${user._id}`);
        setOldNotifications(res.data.notifications || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchEarnings();
    fetchNotifications();

    socket.on('new-notification', (notification) => {
      setRecentNotifications((prev) => [notification, ...prev]);
      axios.get(`https://multi-level-referral-and-earning-system-geln.onrender.com/api/earnings/${user._id}`)
        .then((res) => {
          dispatch(setEarnings(res.data));
      })
        .catch((err) => {
            console.error('Error updating earnings on notification:', err);
      });
            console.log('🔔 New notification:', notification);
      });

    return () => {
      socket.off('new-notification');
    };
  }, [isLoggedIn, user, dispatch]);

  if (!isLoggedIn || !user) return null;

  const chartData = [
    { name: 'Total', amount: earnings?.totalEarnings || 0 },
    { name: 'Level 1', amount: earnings?.level1Earnings || 0 },
    { name: 'Level 2', amount: earnings?.level2Earnings || 0 },
  ];

  return (
    <div className="dashboard-container">
       
      <div className="left-panel">
        <h1 className="tagline">🚀 RefnEarn: Your referrals, your rewards!</h1>

        <div className="user-info">
          <h2>👋 Welcome {user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Referral Code:</strong> {user.referralCode}</p>
          <p><strong>Referred By:</strong> {user.referredBy || 'None'}</p>
        </div>

        {earnings && (
          <div className="earnings-info">
            <h3>💰 Earnings Summary</h3>
            <p><strong>Total:</strong> ₹{earnings.totalEarnings}</p>
            <p><strong>Level 1:</strong> ₹{earnings.level1Earnings}</p>
            <p><strong>Level 2:</strong> ₹{earnings.level2Earnings}</p>
          </div>
        )}

        <div className="chart-container">
          <h3>📊 Earnings Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4CAF50" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="right-panel">
        <h3>🔔 Notifications</h3>

        {recentNotifications.length > 0 && (
          <>
            <h4>🟢 Recent</h4>
            <ul>
              {recentNotifications.map((notif, idx) => (
                <li key={`recent-${idx}`} className="recent">
                  {notif.message}
                </li>
              ))}
            </ul>
          </>
        )}

        {oldNotifications.length > 0 && (
          <>
            <h4>📜 Older</h4>
            <ul>
              {oldNotifications.map((notif, idx) => (
                <li key={`old-${idx}`} className="old">
                  {notif.message}
                </li>
              ))}
            </ul>
          </>
        )}

        {recentNotifications.length === 0 && oldNotifications.length === 0 && (
          <p className="no-notify">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}
