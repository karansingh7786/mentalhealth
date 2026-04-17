import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Activity, Brain, Heart, History, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindAlert — Student Fatigue & Mental Health Analyzer" },
      { name: "description", content: "Track your fatigue and improve your mental well-being with AI-powered insights designed for students." },
      { property: "og:title", content: "MindAlert — Student Fatigue & Mental Health Analyzer" },
      { property: "og:description", content: "Track your fatigue and improve your mental well-being with AI-powered insights." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full blur-3xl opacity-30" style={{ background: "var(--gradient-primary)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered mental wellness for students
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="gradient-text">MindAlert</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-4 max-w-3xl mx-auto">
            Track your fatigue and improve your mental well-being
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
            Mental health is just as important as academic success. MindAlert helps students recognize fatigue
            early, understand its causes, and take meaningful action — backed by AI insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary hover:[transform:translateY(-2px)]">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="btn-ghost hover:bg-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Mental Health Matters</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Burnout, sleep deprivation, and chronic stress are silent epidemics among students.
            Awareness is the first step toward change.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: "Wellbeing first", text: "Healthy minds learn faster, retain more, and build resilience." },
            { icon: ShieldCheck, title: "Prevention matters", text: "Catching warning signs early prevents long-term burnout." },
            { icon: Brain, title: "Smarter studying", text: "Rested minds outperform exhausted ones — every single time." },
          ].map((c) => (
            <div key={c.title} className="glass-card p-7 hover:translate-y-[-4px] transition">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-primary)" }}>
                <c.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Built for the way students live</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to stay aware, balanced, and energized.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: "Fatigue Detection", text: "Smart scoring based on your sleep, study, screen time, and stress." },
            { icon: Sparkles, title: "AI Insights", text: "Personalized explanations and recovery suggestions powered by AI." },
            { icon: History, title: "History Tracking", text: "Visualize trends over time and watch your habits improve." },
          ].map((c) => (
            <div key={c.title} className="glass-card p-7 hover:translate-y-[-4px] transition">
              <c.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="glass-card p-12 text-center" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to feel better?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Take 30 seconds to analyze your fatigue and get a personalized plan.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-background text-foreground font-semibold hover:translate-y-[-2px] transition">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
