import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-10 md:p-16 rounded-3xl text-center max-w-3xl animate-in fade-in zoom-in duration-500">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-purple-400">
          MindAlert
        </h1>
        <p className="text-xl text-slate-300 mb-10 font-medium">
          AI-Based Mental Fatigue & Stress Detection System
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="w-full md:w-auto px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(88,166,255,0.4)] hover:shadow-[0_0_30px_rgba(88,166,255,0.6)] hover:-translate-y-1">
            Get Started
          </Link>
          <Link href="/signup" className="w-full md:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
