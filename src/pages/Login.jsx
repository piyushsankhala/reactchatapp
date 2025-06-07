import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        alert("Email is already verified. You can now log in.");
        return;
      }

      await sendEmailVerification(user);
      alert("Verification email has been resent. Please check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-700 bg-opacity-60 backdrop-blur-md rounded-xl p-8 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow tracking-wide">
          Welcome Back 👋
        </h2>

        <div className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <button
            onClick={resendVerification}
            className="text-sm text-blue-400 hover:underline block text-center"
          >
            Resend Verification Email
          </button>

          <p className="text-center text-slate-300">
            Not a user?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-500 font-semibold transition"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
