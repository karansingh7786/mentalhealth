import { Brain, Activity, Target } from "lucide-react";

export default function About() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">About MindAlert</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Understanding the importance of mental well-being in academic environments and how MindAlert is built to protect it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">What is Mental Health?</h3>
          <p className="text-slate-600 leading-relaxed">
            Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make healthy choices. For students, it's the foundation of effective learning and personal growth.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">Why Fatigue Matters</h3>
          <p className="text-slate-600 leading-relaxed">
            Chronic study hours and continuous screen time can quickly lead to mental fatigue. When fatigued, concentration drops, memory retention suffers, and overall academic performance declines. Recognizing fatigue early is crucial to preventing long-term burnout.
          </p>
        </div>
      </div>

      <div className="glass-panel text-center p-8 md:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-6">How MindAlert Works</h3>
        <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8 text-lg">
          MindAlert uses advanced Natural Language Processing (Gemini AI) and local algorithms to analyze your daily habits. By tracking your sleep routines, cognitive load (study hours), screen exposure, and perceived stress, the system outputs an overall fatigue status and generates personalized insights.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 flex-1">
            <span className="text-xl font-bold text-slate-800 block mb-1">1. Input</span>
            <span className="text-slate-500 text-sm">Provide your 24h metrics</span>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 flex-1">
            <span className="text-xl font-bold text-slate-800 block mb-1">2. Analyze</span>
            <span className="text-slate-500 text-sm">AI evaluates fatigue levels</span>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 flex-1">
            <span className="text-xl font-bold text-slate-800 block mb-1">3. Improve</span>
            <span className="text-slate-500 text-sm">Follow tailored insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}
