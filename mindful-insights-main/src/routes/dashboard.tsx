import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Activity, Sparkles, Quote, Lightbulb, Clock, ListChecks, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MindAlert" }, { name: "description", content: "Analyze your fatigue and get personalized insights." }] }),
  component: Dashboard,
});

type Result = {
  status: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  suggestion: string;
  insight: string;
  quote: string;
  reasons: string[];
  plan: string[];
  recoveryHours: number;
};

type HistoryEntry = { date: string; status: Result["status"]; score: number };

function analyze(sleep: number, study: number, screen: number, stress: number): Result {
  // Higher score = more fatigued
  const sleepPenalty = Math.max(0, (8 - sleep) * 8); // <8h adds up
  const studyPenalty = Math.max(0, (study - 4) * 4);
  const screenPenalty = Math.max(0, (screen - 3) * 5);
  const stressPenalty = stress * 7;
  const raw = sleepPenalty + studyPenalty + screenPenalty + stressPenalty;
  const score = Math.min(100, Math.round(raw));

  let status: Result["status"] = "LOW";
  if (score >= 65) status = "HIGH";
  else if (score >= 35) status = "MEDIUM";

  const reasons: string[] = [];
  if (sleep < 7) reasons.push(`Sleep is below recommended (${sleep}h vs 7–9h).`);
  if (study > 6) reasons.push(`High study load (${study}h) without enough breaks.`);
  if (screen > 5) reasons.push(`Excessive screen time (${screen}h) strains your eyes & brain.`);
  if (stress >= 7) reasons.push(`Stress level (${stress}/10) is significantly elevated.`);
  if (reasons.length === 0) reasons.push("Your habits are well-balanced today.");

  const plan: string[] = [];
  if (sleep < 7) plan.push("Aim for 7–9 hours of sleep tonight.");
  if (study > 6) plan.push("Apply the Pomodoro technique: 25m focus / 5m break.");
  if (screen > 5) plan.push("Take a 20-minute screen-free walk.");
  if (stress >= 6) plan.push("Try 5 minutes of deep breathing or meditation.");
  plan.push("Drink a glass of water and stretch your shoulders.");

  const recoveryHours = status === "LOW" ? 2 : status === "MEDIUM" ? 6 : 12;

  const quotes = [
    "Rest is not idleness — it is the foundation of growth.",
    "You can't pour from an empty cup. Take care of yourself first.",
    "Small daily improvements lead to stunning long-term results.",
  ];

  return {
    status,
    score,
    suggestion:
      status === "HIGH"
        ? "Pause, breathe, and prioritize rest tonight. Your brain needs recovery."
        : status === "MEDIUM"
        ? "You're managing, but small habits could help you bounce back."
        : "You're doing great — keep this rhythm going!",
    insight:
      status === "HIGH"
        ? "Your combined sleep deficit and high stress suggest cognitive overload. Productivity past this point drops sharply."
        : status === "MEDIUM"
        ? "You're operating below peak. A short reset now will protect tomorrow's focus."
        : "Your indicators show balanced cognitive load. Sustain this with consistency.",
    quote: quotes[Math.floor(Math.random() * quotes.length)],
    reasons,
    plan,
    recoveryHours,
  };
}

const statusColor: Record<Result["status"], string> = {
  LOW: "text-success",
  MEDIUM: "text-warning",
  HIGH: "text-danger",
};
const statusBg: Record<Result["status"], string> = {
  LOW: "bg-success/15 border-success/30",
  MEDIUM: "bg-warning/15 border-warning/30",
  HIGH: "bg-danger/15 border-danger/30",
};
const barColor: Record<Result["status"], string> = {
  LOW: "bg-success",
  MEDIUM: "bg-warning",
  HIGH: "bg-danger",
};

function Slider({ label, value, onChange, min, max, unit }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; unit: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-primary font-semibold">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer bg-muted"
      />
    </div>
  );
}

function Dashboard() {
  const [sleep, setSleep] = useState(7);
  const [study, setStudy] = useState(5);
  const [screen, setScreen] = useState(4);
  const [stress, setStress] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([
    { date: "2 days ago", status: "MEDIUM", score: 48 },
    { date: "3 days ago", status: "LOW", score: 22 },
    { date: "5 days ago", status: "HIGH", score: 78 },
    { date: "1 week ago", status: "MEDIUM", score: 55 },
  ]);

  function onAnalyze() {
    setLoading(true);
    setTimeout(() => {
      const r = analyze(sleep, study, screen, stress);
      setResult(r);
      setHistory((h) => [{ date: "Today", status: r.status, score: r.score }, ...h].slice(0, 5));
      setLoading(false);
    }, 1000);
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">MindAlert <span className="gradient-text">Dashboard</span></h1>
          <p className="text-muted-foreground mt-2">Adjust the sliders to reflect your day, then analyze your fatigue.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="glass-card p-7 space-y-6 h-fit">
            <h2 className="font-semibold text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Your day</h2>
            <Slider label="Sleep Hours" value={sleep} onChange={setSleep} min={0} max={12} unit="h" />
            <Slider label="Study Hours" value={study} onChange={setStudy} min={0} max={14} unit="h" />
            <Slider label="Screen Time" value={screen} onChange={setScreen} min={0} max={14} unit="h" />
            <Slider label="Stress Level" value={stress} onChange={setStress} min={0} max={10} unit="/10" />
            <button onClick={onAnalyze} disabled={loading} className="w-full btn-primary disabled:opacity-70 hover:[transform:translateY(-2px)]">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <>Analyze Fatigue</>}
            </button>
          </div>

          {/* Right: Result */}
          <div className="glass-card p-7">
            {!result ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground">
                <Sparkles className="h-10 w-10 mb-4 text-primary/60" />
                <p>Your personalized fatigue report will appear here.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className={`rounded-xl border p-5 ${statusBg[result.status]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Fatigue Status</span>
                    <span className={`font-bold text-xl ${statusColor[result.status]}`}>{result.status}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                    <span>Score</span><span>{result.score}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${barColor[result.status]} transition-all duration-700`} style={{ width: `${result.score}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted border border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Suggestion</p>
                  <p className="text-sm">{result.suggestion}</p>
                </div>

                <div className="p-4 rounded-xl bg-muted border border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> AI Insight</p>
                  <p className="text-sm">{result.insight}</p>
                </div>

                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex gap-3">
                  <Quote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm italic">{result.quote}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extra sections */}
        {result && (
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-warning" /> Why this result?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {result.reasons.map((r, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{r}</li>)}
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><ListChecks className="h-4 w-4 text-success" /> Improvement Plan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {result.plan.map((p, i) => <li key={i} className="flex gap-2"><span className="text-success">✓</span>{p}</li>)}
              </ul>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Recovery Time</h3>
              <p className="text-4xl font-bold gradient-text">{result.recoveryHours}h</p>
              <p className="text-sm text-muted-foreground mt-2">Estimated rest needed to fully recover and return to peak focus.</p>
            </div>
          </div>
        )}

        {/* History */}
        <div className="glass-card p-6 mt-6">
          <h3 className="font-semibold mb-4">Recent History</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
                <span className="text-sm text-muted-foreground">{h.date}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Score: <span className="font-semibold">{h.score}</span></span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBg[h.status]} ${statusColor[h.status]}`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
