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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl flex flex-col h-full min-h-[90vh] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
            Chat with{' '}
            <span className="underline decoration-pink-500">
              {user?.email || 'User'}
            </span>
          </h2>
          <button
            onClick={handleLogout}
            className="text-red-400 font-semibold hover:text-red-500 transition duration-300"
            title="Logout"
          >
            Logout
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4 custom-scroll">
          {messages.length === 0 && (
            <p className="text-center text-gray-300 italic animate-pulse">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[75%] px-4 py-2 rounded-lg shadow transition-all 
                ${
                  msg.userId === auth.currentUser.uid
                    ? 'ml-auto bg-indigo-400 text-white animate-fadeInRight'
                    : 'mr-auto bg-slate-200 text-black animate-fadeInLeft'
                }`}
            >
              <p className="text-xs font-semibold opacity-70 mb-1">
                {msg.userName}
              </p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/70 text-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-5 py-3 rounded-md hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
