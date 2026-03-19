"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_id", data.user_id);
        router.push("/dashboard");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 md:p-10 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-slate-400 mb-8">Join MindAlert and manage stress.</p>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button disabled={loading} className="w-full mt-4 bg-primary text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
