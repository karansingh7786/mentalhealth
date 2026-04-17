import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Brain, GraduationCap, Cpu, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — MindAlert" }, { name: "description", content: "Learn about mental health, student fatigue, and how MindAlert works." }] }),
  component: About,
});

function About() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About <span className="gradient-text">MindAlert</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">A simple but powerful tool helping students stay aware of their mental wellbeing.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="glass-card p-7">
            <HeartPulse className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">What is mental health?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mental health includes our emotional, psychological, and social wellbeing. It affects how we think,
              feel, learn, and handle stress — and it's just as essential as physical health.
            </p>
          </div>
          <div className="glass-card p-7">
            <GraduationCap className="h-8 w-8 text-accent mb-4" />
            <h2 className="text-xl font-semibold mb-2">Why fatigue matters for students</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chronic fatigue impairs memory, focus, and decision-making. Students who ignore early warning signs
              often face burnout, lower grades, and long-term anxiety. Early detection changes outcomes.
            </p>
          </div>
          <div className="glass-card p-7">
            <Cpu className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">How the system works</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You enter four daily indicators — sleep, study time, screen time, and stress. MindAlert calculates a
              fatigue score, classifies your state, and uses AI logic to generate personalized insights and a recovery plan.
            </p>
          </div>
          <div className="glass-card p-7">
            <Brain className="h-8 w-8 text-accent mb-4" />
            <h2 className="text-xl font-semibold mb-2">Built for awareness</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MindAlert isn't a medical tool — it's a daily mirror. By tracking small signals over time, you build
              healthier habits and notice patterns that would otherwise go unseen.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
