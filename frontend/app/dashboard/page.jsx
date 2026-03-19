"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({ sleep: 7, study: 4, screen: 5, stress: 5 });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check Auth
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      router.push("/login");
    } else {
      setUserId(storedUserId);
      loadHistory(storedUserId);
    }
  }, []);

  const loadHistory = async (uid) => {
    try {
      const res = await fetch(`http://localhost:5000/history?user_id=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to load history.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    router.push("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      });
      
      const data = await res.json();
      setResult(data);
      loadHistory(userId); // refresh history

      if (data.fatigue === "HIGH") {
        setTimeout(() => alert(`⚠️ CRITICAL FATIGUE: ${data.message}`), 100);
      }
    } catch (error) {
      alert("Failed to connect to backend. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (level) => {
    if (level === "HIGH") return "text-high bg-high/10 border-high/30";
    if (level === "MEDIUM") return "text-medium bg-medium/10 border-medium/30";
    if (level === "LOW") return "text-low bg-low/10 border-low/30";
    return "";
  };

  // Render the structured AI JSON nicely
  const renderRecommendation = (recInput) => {
    if (!recInput) return null;
    let data;
    try {
      data = typeof recInput === "string" ? JSON.parse(recInput) : recInput;
    } catch (e) {
      return <p className="text-slate-200 mt-4">{recInput}</p>;
    }
    
    // Fallback if not JSON format
    if (!data.suggestion) return <p className="text-slate-200 mt-4">{recInput}</p>;

    return (
      <div className="mt-6 flex flex-col gap-4 text-left w-full">
        <div className="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
          <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wide flex items-center gap-2">
            <span>💡</span> Suggestion
          </h3>
          <p className="text-slate-200 text-sm">{data.suggestion}</p>
        </div>
        
        <div className="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
          <h3 className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wide flex items-center gap-2">
            <span>🧠</span> AI Insight
          </h3>
          <p className="text-slate-200 text-sm">{data.summary}</p>
        </div>

        <div className="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
          <h3 className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wide flex items-center gap-2">
            <span>🌟</span> Motivation
          </h3>
          <p className="text-slate-300 text-sm italic font-medium">"{data.quote}"</p>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-4 py-8">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">MindAlert Dashboard</h1>
        <button onClick={handleLogout} className="text-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Logout</button>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Form Panel */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
            <h2 className="text-xl font-semibold mb-2">Track Daily Metrics</h2>
            
            {/* Sleep */}
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Sleep Hours (Last 24h)</span>
                <span className="text-primary">{formData.sleep}h</span>
              </label>
              <input type="range" name="sleep" min="0" max="24" step="0.5" value={formData.sleep} onChange={handleChange} />
            </div>

            {/* Study */}
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Study/Work Hours</span>
                <span className="text-primary">{formData.study}h</span>
              </label>
              <input type="range" name="study" min="0" max="24" step="0.5" value={formData.study} onChange={handleChange} />
            </div>

            {/* Screen Time */}
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Screen Time</span>
                <span className="text-primary">{formData.screen}h</span>
              </label>
              <input type="range" name="screen" min="0" max="24" step="0.5" value={formData.screen} onChange={handleChange} />
            </div>

            {/* Stress Level */}
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Stress Level (1-10)</span>
                <span className="text-primary">{formData.stress}/10</span>
              </label>
              <input type="range" name="stress" min="1" max="10" step="1" value={formData.stress} onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading} className="mt-8 w-full py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 hover:-translate-y-1">
              {loading ? "Analyzing..." : "Analyze Fatigue"}
            </button>
          </form>
        </div>

        {/* Right Details Panel */}
        <div className="flex flex-col gap-6">
          
          {/* Active Result Card */}
          <div className={`glass-panel p-8 rounded-2xl flex flex-col items-center ${result ? getColor(result.fatigue) : 'border-white/10'}`}>
            {result ? (
              <div className="animate-in fade-in zoom-in duration-300 w-full flex flex-col items-center">
                <p className="text-sm tracking-widest uppercase opacity-70 mb-2">Status</p>
                <div className="flex flex-col items-center gap-2 mb-2">
                  <h2 className={`text-4xl font-extrabold ${result.fatigue === 'HIGH' ? 'text-high' : result.fatigue === 'MEDIUM' ? 'text-medium' : 'text-low'}`}>
                    {result.fatigue}
                  </h2>
                  <span className="text-lg font-medium opacity-90">{result.message}</span>
                </div>
                
                {renderRecommendation(result.recommendation)}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[250px]">
                <p className="text-slate-500">Submit your metrics to unlock smart AI insights.</p>
              </div>
            )}
          </div>

          {/* History Card */}
          <div className="glass-panel p-6 rounded-2xl flex-grow overflow-hidden flex flex-col min-h-[250px]">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">Your Recent History</h3>
            {history.length > 0 ? (
              <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {history.map((log) => (
                  <li key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-sm hover:bg-white/10 transition-colors">
                    <span className="text-slate-300">
                      {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getColor(log.fatigue_result)}`}>
                      {log.fatigue_result}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic m-auto">No records found for your account.</p>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
