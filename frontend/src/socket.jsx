 
import { io } from 'socket.io-client';

const socket = io('https://multi-level-referral-and-earning-system-geln.onrender.com', {
  autoConnect: false, 
  transports: ['websocket'],
});

export default socket;
