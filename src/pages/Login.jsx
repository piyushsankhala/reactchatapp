import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center drop-shadow-md">
          Welcome Back
        </h2>
        <div className="space-y-6">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition duration-300"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition duration-300"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800
              focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
          <p className="text-center text-gray-700">
            Not a user?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
