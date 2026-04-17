"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Activity, Brain, Clock, Target, AlertCircle, HeartPulse, CheckSquare, History } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({ sleep: 7, study: 4, screen: 5, stress: 5 });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extInsights, setExtInsights] = useState(null);
  const [fatigueScore, setFatigueScore] = useState(0);

  useEffect(() => {
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
      const API = process.env.NEXT_PUBLIC_API_URL || "https://mentalhealth-d7cp.onrender.com";
      const res = await fetch(`${API}/history?user_id=${uid}`);
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
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const calculateScore = (data) => {
    let score = 0;
    if (data.sleep < 7) score += (7 - data.sleep) * 8;
    if (data.study > 8) score += (data.study - 8) * 3;
    if (data.screen > 5) score += (data.screen - 5) * 3;
    score += (data.stress * 4);
    if (data.sleep >= 8 && data.stress <= 3 && data.screen <= 4) score = Math.max(score - 10, 5);
    return Math.min(Math.max(Math.round(score), 5), 98);
  };

  const generateInsights = (data, level) => {
    let reasons = [];
    let plan = [];
    let recovery = "12-24 hours";

    if (data.sleep < 7) {
      reasons.push(`Inadequate sleep (${data.sleep}h)`);
      plan.push("Aim for 7-9 hours of continuous sleep tonight.");
    }
    if (data.screen >= 8) {
      reasons.push(`High screen exposure (${data.screen}h)`);
      plan.push("Implement the 20-20-20 rule for your eyes.");
    }
    if (data.stress >= 7) {
      reasons.push("Elevated stress levels");
      plan.push("Practice 10 mins of mindfulness or breathing.");
    }
    if (data.study >= 8) {
      reasons.push(`Intense cognitive load (${data.study}h)`);
      plan.push("Take at least 15 min break per 90 mins of work.");
    }
    
    if (reasons.length === 0) {
      reasons.push("Relatively balanced routine");
      plan.push("Keep maintaining current healthy habits!");
    }

    if (level === "HIGH") recovery = "48-72 hours of active rest";
    else if (level === "MEDIUM") recovery = "24-48 hours";

    return { reasons, plan, recovery };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "https://mentalhealth-d7cp.onrender.com";
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      });
      
      const data = await res.json();
      setResult(data);
      
      const computedScore = calculateScore(formData);
      setFatigueScore(computedScore);
      setExtInsights(generateInsights(formData, data.fatigue));
      
      loadHistory(userId);
    } catch (error) {
      alert("Failed to connect to backend. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (level) => {
    if (level === "HIGH") return "text-red-600 bg-red-100 border-red-200";
    if (level === "MEDIUM") return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (level === "LOW") return "text-green-600 bg-green-100 border-green-200";
    return "";
  };

  const getProgressColor = (score) => {
    if (score >= 70) return "bg-red-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const renderRecommendation = (recInput) => {
    if (!recInput) return null;
    let data;
    try {
      data = typeof recInput === "string" ? JSON.parse(recInput) : recInput;
    } catch (e) {
      return <p className="text-slate-600 mt-4">{recInput}</p>;
    }
    
    if (!data.suggestion) return <p className="text-slate-600 mt-4">{recInput}</p>;

    return (
      <div className="mt-6 flex flex-col gap-4 text-left w-full">
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" /> Suggestion
          </h3>
          <p className="text-slate-700 text-sm">{data.suggestion}</p>
        </div>
        
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <h3 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" /> AI Insight
          </h3>
          <p className="text-slate-700 text-sm">{data.summary}</p>
        </div>

        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
          <h3 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-2">
            <HeartPulse className="w-4 h-4" /> Motivation
          </h3>
          <p className="text-slate-700 text-sm italic font-medium">"{data.quote}"</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 glass-panel bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" /> MindAlert Dashboard
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-5 glass-panel bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col self-start">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-grow">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Current Status</h2>
              <p className="text-slate-500 text-sm mt-1">Adjust sliders to reflect your last 24 hours.</p>
            </div>
            
            <div className="space-y-6">
              {/* Sleep */}
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                  <span>Sleep Hours</span>
                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{formData.sleep}h</span>
                </label>
                <input type="range" name="sleep" min="0" max="24" step="0.5" value={formData.sleep} onChange={handleChange} className="w-full" />
              </div>

              {/* Study */}
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                  <span>Study/Work Hours</span>
                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{formData.study}h</span>
                </label>
                <input type="range" name="study" min="0" max="24" step="0.5" value={formData.study} onChange={handleChange} className="w-full" />
              </div>

              {/* Screen Time */}
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                  <span>Screen Time</span>
                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{formData.screen}h</span>
                </label>
                <input type="range" name="screen" min="0" max="24" step="0.5" value={formData.screen} onChange={handleChange} className="w-full" />
              </div>

              {/* Stress Level */}
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-3">
                  <span>Stress Level (1-10)</span>
                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{formData.stress}/10</span>
                </label>
                <input type="range" name="stress" min="1" max="10" step="1" value={formData.stress} onChange={handleChange} className="w-full" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="mt-4 w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 flex items-center justify-center">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing Data...
                </span>
              ) : "Analyze Fatigue"}
            </button>
          </form>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Result Card */}
          <div className={`glass-panel bg-white p-6 md:p-8 rounded-3xl border ${result ? 'border-slate-200 shadow-xl shadow-slate-200/40' : 'border-slate-200 flex flex-col items-center justify-center min-h-[300px]'}`}>
            {result ? (
              <div className="animate-in fade-in zoom-in duration-500 w-full">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mx-auto w-full gap-6 mb-6">
                  {/* Status Badge */}
                  <div className="flex flex-col gap-2">
                     <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Detection Result</p>
                     <div className={`inline-flex items-center px-4 py-2 rounded-xl border ${getColor(result.fatigue)}`}>
                       <span className="text-2xl font-black">{result.fatigue}</span>
                     </div>
                  </div>

                  {/* Fatigue Score */}
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Fatigue Score</p>
                      <span className="text-xl font-black text-slate-800">{fatigueScore}<span className="text-sm font-bold text-slate-400">/100</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(fatigueScore)}`} style={{ width: `${fatigueScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {extInsights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t border-slate-100 pt-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-2">
                        <AlertCircle className="w-3.5 h-3.5" /> Why this result?
                      </h4>
                      <ul className="text-sm text-slate-700 list-disc pl-4 space-y-1">
                        {extInsights.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-2">
                        <CheckSquare className="w-3.5 h-3.5" /> Improvement Plan
                      </h4>
                      <ul className="text-sm text-slate-700 list-disc pl-4 space-y-1">
                        {extInsights.plan.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                {extInsights && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recovery Estimate
                    </h4>
                    <span className="text-sm font-bold text-slate-800">{extInsights.recovery}</span>
                  </div>
                )}
                
                {renderRecommendation(result.recommendation)}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Awaiting Data</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Submit your daily metrics on the left to unlock smart AI insights and view your fatigue score.</p>
              </div>
            )}
          </div>

          {/* History Card */}
          <div className="glass-panel bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex-grow overflow-hidden flex flex-col min-h-[250px]">
            <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
              <History className="w-4 h-4" /> Recent History
            </h3>
            {history.length > 0 ? (
              <ul className="space-y-3 overflow-y-auto pr-2">
                {history.map((log) => (
                  <li key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col">
                       <span className="font-semibold text-slate-800">
                         {new Date(log.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                       </span>
                       <span className="text-xs text-slate-500">
                         {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black border ${getColor(log.fatigue_result)}`}>
                      {log.fatigue_result}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="m-auto text-center">
                <p className="text-slate-500 text-sm font-medium">No records found.</p>
                <p className="text-slate-400 text-xs mt-1">Your past reports will appear here.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
