import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import React from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import LogoutButton from "../components/Logoutbutton";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (text.trim()) {
      await addDoc(collection(db, "messages"), {
        text,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      setText("");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2>Welcome, {auth.currentUser?.email}</h2>
        <LogoutButton />
      </div>

      <div className="mt-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-100 p-2 rounded">
            <strong>{msg.email}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}