import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.id !== auth.currentUser?.uid); // Exclude current user
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const startChat = (user) => {
    const chatId = [auth.currentUser.uid, user.id].sort().join('_');
    navigate(`/chat/${chatId}`, { state: { user } });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white flex flex-col items-center justify-start p-6 relative">
      
      {/* 🔴 Top-right Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-red-400 font-semibold hover:text-red-500 transition duration-300"
        title="Logout"
      >
        Logout
      </button>

      <div className="w-full max-w-lg bg-slate-700 bg-opacity-60 rounded-xl shadow-xl p-6 mt-16 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide text-white drop-shadow">
          Chat with Users
        </h2>

        <ul className="space-y-4">
          {users.length === 0 && (
            <li className="text-center text-slate-300 italic animate-pulse">
              No users found
            </li>
          )}
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => startChat(user)}
              className="cursor-pointer bg-slate-600 hover:bg-slate-500 transition-all duration-300 p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transform"
              title={`Start chat with ${user.email}`}
            >
              <p className="text-lg font-medium">{user.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
