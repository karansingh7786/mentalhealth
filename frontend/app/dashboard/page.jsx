"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Sparkles, Quote, Lightbulb, Clock, ListChecks, Loader2, LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  
  const [sleep, setSleep] = useState(7);
  const [study, setStudy] = useState(5);
  const [screen, setScreen] = useState(4);
  const [stress, setStress] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      router.push("/login");
    } else {
      setUserId(storedUserId);
      loadHistory(storedUserId);
    }
  }, []);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "https://mentalhealth-d7cp.onrender.com";

  const loadHistory = async (uid) => {
    try {
      const res = await fetch(`${getApiUrl()}/history?user_id=${uid}`);
      if (res.ok) {
        const data = await res.json();
        // format data
        const formatted = data.map(log => {
           let score = 50; 
           const sPenalty = Math.max(0, (8 - log.sleep_hours) * 8);
           const stPenalty = Math.max(0, (log.study_hours - 4) * 4);
           const scPenalty = Math.max(0, (log.screen_time - 3) * 5);
           const strPenalty = log.stress_level * 7;
           score = Math.min(100, Math.round(sPenalty + stPenalty + scPenalty + strPenalty));
           
           return {
             date: new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: "2-digit", minute: "2-digit" }),
             status: log.fatigue_result,
             score: score
           };
        });
        setHistory(formatted);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    router.push("/");
  };

  const analyzeLocal = (sleep, study, screen, stress) => {
    const sleepPenalty = Math.max(0, (8 - sleep) * 8);
    const studyPenalty = Math.max(0, (study - 4) * 4);
    const screenPenalty = Math.max(0, (screen - 3) * 5);
    const stressPenalty = stress * 7;
    const raw = sleepPenalty + studyPenalty + screenPenalty + stressPenalty;
    const score = Math.min(100, Math.round(raw));

    let status = "LOW";
    if (score >= 65) status = "HIGH";
    else if (score >= 35) status = "MEDIUM";

    const reasons = [];
    if (sleep < 7) reasons.push(`Sleep is below recommended (${sleep}h vs 7–9h).`);
    if (study > 6) reasons.push(`High study load (${study}h) without enough breaks.`);
    if (screen > 5) reasons.push(`Excessive screen time (${screen}h) strains your eyes & brain.`);
    if (stress >= 7) reasons.push(`Stress level (${stress}/10) is significantly elevated.`);
    if (reasons.length === 0) reasons.push("Your habits are well-balanced today.");

    const plan = [];
    if (sleep < 7) plan.push("Aim for 7–9 hours of sleep tonight.");
    if (study > 6) plan.push("Apply the Pomodoro technique: 25m focus / 5m break.");
    if (screen > 5) plan.push("Take a 20-minute screen-free walk.");
    if (stress >= 6) plan.push("Try 5 minutes of deep breathing or meditation.");
    plan.push("Drink a glass of water and stretch your shoulders.");

    const recoveryHours = status === "LOW" ? 2 : status === "MEDIUM" ? 6 : 12;

    return { score, status, reasons, plan, recoveryHours };
  };

  async function onAnalyze() {
    setLoading(true);
    try {
      const payload = {
        user_id: userId,
        sleep,
        study,
        screen,
        stress
      };
      const res = await fetch(`${getApiUrl()}/predict`, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      const localCalc = analyzeLocal(sleep, study, screen, stress);
      
      // Parse AI output
      let aiFields = { suggestion: "", insight: "", quote: "" };
      if (data.recommendation) {
        let rec = data.recommendation;
        if (typeof rec === 'string') {
          try { rec = JSON.parse(rec); } catch(e) {}
        }
        aiFields.suggestion = rec.suggestion || "Take rest.";
        aiFields.insight = rec.summary || "You may be experiencing fatigue.";
        aiFields.quote = rec.quote || "Rest if you must, but don't quit.";
      }

      setResult({
        ...localCalc,
        status: data.fatigue || localCalc.status,
        suggestion: aiFields.suggestion,
        insight: aiFields.insight,
        quote: aiFields.quote,
      });

      loadHistory(userId);
    } catch (e) {
      alert("Failed to analyze. Is backend running?");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = {
    LOW: "text-green-600",
    MEDIUM: "text-amber-600",
    HIGH: "text-red-600",
  };
  const statusBg = {
    LOW: "bg-green-50 border-green-200",
    MEDIUM: "bg-amber-50 border-amber-200",
    HIGH: "bg-red-50 border-red-200",
  };
  const barColor = {
    LOW: "bg-green-500",
    MEDIUM: "bg-amber-500",
    HIGH: "bg-red-500",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[calc(100vh-80px)]">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">MindAlert <span className="gradient-text">Dashboard</span></h1>
          <p className="text-muted-foreground mt-2">Adjust the sliders to reflect your day, then analyze your fatigue.</p>
        </div>
        <button onClick={handleLogout} className="btn-ghost text-sm px-4 py-2 hover:bg-black/5 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Left: Inputs */}
        <div className="glass-card p-7 space-y-6">
          <h2 className="font-semibold text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Your day</h2>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Sleep Hours</label>
              <span className="text-sm text-primary font-semibold">{sleep}h</span>
            </div>
            <input type="range" min={0} max={12} step={0.5} value={sleep} onChange={(e) => setSleep(Number(e.target.value))} className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer bg-muted" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Study Hours</label>
              <span className="text-sm text-primary font-semibold">{study}h</span>
            </div>
            <input type="range" min={0} max={14} step={0.5} value={study} onChange={(e) => setStudy(Number(e.target.value))} className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer bg-muted" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Screen Time</label>
              <span className="text-sm text-primary font-semibold">{screen}h</span>
            </div>
            <input type="range" min={0} max={14} step={0.5} value={screen} onChange={(e) => setScreen(Number(e.target.value))} className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer bg-muted" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Stress Level</label>
              <span className="text-sm text-primary font-semibold">{stress}/10</span>
            </div>
            <input type="range" min={0} max={10} step={1} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer bg-muted" />
          </div>

          <button onClick={onAnalyze} disabled={loading} className="w-full btn-primary disabled:opacity-70 hover:-translate-y-0.5 transition">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <>Analyze Fatigue</>}
          </button>
        </div>

        {/* Right: Result */}
        <div className="glass-card p-7">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground min-h-[350px]">
              <Sparkles className="h-10 w-10 mb-4 text-primary/60" />
              <p>Your personalized fatigue report will appear here.</p>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className={`rounded-xl border p-5 ${statusBg[result.status]}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground font-semibold">Fatigue Status</span>
                  <span className={`font-bold text-xl ${statusColor[result.status]}`}>{result.status}</span>
                </div>
                <div className="flex items-center justify-between mb-1.5 text-xs text-muted-foreground font-medium">
                  <span>Estimated Score</span><span>{result.score}/100</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${barColor[result.status]} transition-all duration-1000`} style={{ width: `${result.score}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">AI Suggestion</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{result.suggestion}</p>
              </div>

              <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> AI Summary</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{result.insight}</p>
              </div>

              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-3 shadow-inner">
                <Quote className="h-5 w-5 text-primary shrink-0 opacity-70" />
                <p className="text-sm italic font-medium text-foreground/80">{result.quote}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extra sections */}
      {result && (
        <div className="grid md:grid-cols-3 gap-6 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-warning" /> Why this result?</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {result.reasons.map((r, i) => <li key={i} className="flex gap-2.5 items-start"><span className="text-primary mt-0.5">•</span><span className="leading-tight">{r}</span></li>)}
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><ListChecks className="h-4 w-4 text-success" /> Improvement Plan</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {result.plan.map((p, i) => <li key={i} className="flex gap-2.5 items-start"><span className="text-success font-bold mt-0.5 opacity-80">✓</span><span className="leading-tight">{p}</span></li>)}
            </ul>
          </div>
          <div className="glass-card p-6 flex flex-col justify-center items-center text-center">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-xs"><Clock className="h-4 w-4 text-accent" /> Recovery Scope</h3>
            <p className="text-5xl font-extrabold gradient-text my-2">{result.recoveryHours}h</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">Estimated rest needed to fully recover focus.</p>
          </div>
        </div>
      )}

      {/* History */}
      <div className="glass-card p-6 mt-6">
        <h3 className="font-semibold mb-4 text-lg">Your Insight History</h3>
        <div className="space-y-3">
          {history.length > 0 ? history.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors border border-border shadow-sm">
              <span className="text-sm text-foreground/70 font-medium">{h.date}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Score: <span className="font-bold text-foreground">{h.score}</span></span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm ${statusBg[h.status]} ${statusColor[h.status]}`}>{h.status}</span>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground text-sm bg-white/50 rounded-xl border border-dashed border-border">
              Submit your first analysis to start tracking history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
