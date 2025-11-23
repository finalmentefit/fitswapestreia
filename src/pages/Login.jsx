import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || "Login failed");
      } else {
        // redirect to home
        navigate("/home");
      }
    } catch (err) {
      setError("Unexpected error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Sign in to FitSwap</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleLogin}>
          <label className="block mb-2">Email</label>
          <input
            className="w-full mb-3 px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            required
          />
          <label className="block mb-2">Password</label>
          <input
            className="w-full mb-3 px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Your password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="text-right mt-2"><Link to="/reset-password" className="text-sm text-blue-600">Esqueci a senha</Link></div>

        <p className="text-center mt-2 text-gray-600">
          No account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
