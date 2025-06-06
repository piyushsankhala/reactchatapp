// src/components/ChatRoom.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();
  const { user } = location.state || {};

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'privateChats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const messagesRef = collection(db, 'privateChats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      userName: auth.currentUser.email,
    });

    setNewMessage('');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Chat with {user?.email || 'User'}
        </h2>
        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="h-80 overflow-y-auto border p-2 rounded bg-gray-100 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.userId === auth.currentUser.uid
                ? 'bg-blue-200 text-right'
                : 'bg-white text-left'
            }`}
          >
            <p className="text-sm text-gray-600">{msg.userName}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
