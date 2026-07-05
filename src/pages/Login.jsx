import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { login } from "../api/eventAPI";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setShowLoader(true), 3000);

    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert("Invalid credentials or backend not ready yet");
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (!showLoader) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showLoader]);

  if (showLoader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <div className="relative w-24 h-24">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute top-0 left-1/2 w-4 h-4 rounded-full"
              style={{
                backgroundColor:
                  i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : "#F59E0B",
              }}
              animate={{
                rotate: 360,
                x: [0, 36, 0],
                y: [0, 36, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2 + i * 0.3,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <motion.p
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-lg font-medium text-gray-700"
        >
          ⚙️ Backend waking up... please wait{" "}
          <span className="font-semibold text-blue-600">{secondsLeft}s</span>
        </motion.p>
      </div>
    );
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/google`,
        {
          token: credentialResponse.credential,
        },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded-lg space-y-4"
    >
      <h2 className="text-xl font-bold">Login</h2>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full border p-2 rounded"
        required
      />
      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {loading ? "Please wait..." : "Login"}
      </button>
      <div className="flex justify-center mt-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </form>
  );
};

export default Login;
