import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:brightness-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300"
      title="Logout"
    >
      Logout
    </button>
  );
}
