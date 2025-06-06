import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.id !== auth.currentUser.uid); // Exclude current user
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const startChat = (user) => {
    const chatId = [auth.currentUser.uid, user.id].sort().join('_');
    navigate(`/chat/${chatId}`, { state: { user } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 p-6 flex flex-col max-w-md mx-auto rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-lg">Users</h2>
      <ul className="space-y-3">
        {users.length === 0 && (
          <li className="text-center italic animate-pulse">No users found</li>
        )}
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => startChat(user)}
            className="cursor-pointer p-4 bg-white bg-opacity-20 rounded-lg shadow-md hover:bg-white hover:bg-opacity-40 transition duration-300 select-none"
            title={`Start chat with ${user.email}`}
          >
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
