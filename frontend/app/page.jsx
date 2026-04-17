import Link from "next/link";
import { Brain, Activity, History, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-panel bg-white/60 mb-4 animate-fade-in-up">
            <span className="flex w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-700">AI-Powered Health Companion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">MindAlert</span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-700 font-medium">
            Track your fatigue and improve your mental well-being
          </p>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Designed specifically for students, MindAlert helps you balance your studies, screen time, and sleep. Prevent burnout before it happens and receive actionable AI insights to keep your mental health in check.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login" className="px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center group">
              Get Started <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="px-8 py-4 rounded-full glass-panel bg-white text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center border border-slate-200">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to monitor your daily habits and maintain peak performance.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel bg-white/60 p-8 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fatigue Detection</h3>
              <p className="text-slate-600">Input your sleep, study, and screen hours to instantly calculate your current mental fatigue levels.</p>
            </div>
            
            <div className="glass-panel bg-white/60 p-8 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Insights</h3>
              <p className="text-slate-600">Receive personalized, AI-generated suggestions and actionable plans to improve your daily routine.</p>
            </div>
            
            <div className="glass-panel bg-white/60 p-8 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">History Tracking</h3>
              <p className="text-slate-600">Keep a detailed log of your past entries to identify long-term patterns and track your progression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Mental Health Matters */}
      <section className="w-full py-20 px-4 bg-slate-900/5 backdrop-blur-3xl border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Mental Health Matters</h2>
          <p className="text-lg text-slate-700 leading-relaxed text-left md:text-center block">
            As a student, academic pressure, late-night study sessions, and continuous screen exposure can take a severe toll on your cognitive abilities and emotional stability. Ignoring the early signs of mental fatigue leads to burnout, decreased productivity, and long-term health issues. MindAlert gives you the tools to recognize these signs early and take proactive steps towards a balanced, healthier lifestyle.
          </p>
        </div>
      </section>
    </div>
  );
}
