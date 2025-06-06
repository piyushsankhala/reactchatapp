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
      className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300 ease-in-out
                 focus:outline-none focus:ring-4 focus:ring-red-400"
      title="Logout"
    >
      Logout
    </button>
  );
}
