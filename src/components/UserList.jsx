// src/components/UserList.jsx
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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => startChat(user)}
          >
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
