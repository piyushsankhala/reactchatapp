import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('./Login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4">
      <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
