import { useEffect, useState } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatRoom from "./pages/Chatroom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet } from "react-router-dom";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsub;
  }, []);

  return (
    <>
    <h1>
      welcome 
    </h1>

    <Outlet/>
  </>
  );
}

export default App;
