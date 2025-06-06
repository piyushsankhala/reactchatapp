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
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 p-6 flex flex-col max-w-md mx-auto rounded-lg shadow-lg text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold drop-shadow-md">
          Chat with <span className="underline decoration-pink-500">{user?.email || 'User'}</span>
        </h2>
        <button
          onClick={handleLogout}
          className="text-red-600 font-semibold hover:text-red-800 transition duration-300"
          title="Logout"
        >
          Logout
        </button>
      </div>

      <div className="flex-grow overflow-y-auto bg-white rounded-md p-4 shadow-inner mb-4 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 animate-pulse">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 p-3 rounded-lg max-w-[80%] 
              ${
                msg.userId === auth.currentUser.uid
                  ? 'bg-indigo-300 self-end text-right animate-fadeInRight'
                  : 'bg-indigo-100 self-start text-left animate-fadeInLeft'
              }`}
          >
            <p className="text-xs text-gray-700 font-semibold">{msg.userName}</p>
            <p className="mt-1">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-md border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300"
          title="Send Message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
