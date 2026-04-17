import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Moon, Coffee, Smartphone, Dumbbell, Apple, Users, BookOpen, Wind } from "lucide-react";

export const Route = createFileRoute("/tips")({
  head: () => ({ meta: [{ title: "Mental Health Tips — MindAlert" }, { name: "description", content: "Daily tips to reduce fatigue and improve student wellbeing." }] }),
  component: Tips,
});

const tips = [
  { icon: Moon, title: "Sleep properly", text: "Aim for 7–9 hours. Keep a consistent bedtime — even on weekends." },
  { icon: Coffee, title: "Take breaks", text: "Use the Pomodoro method: 25 minutes of focus, 5 minutes of rest." },
  { icon: Smartphone, title: "Reduce screen time", text: "Step away from screens every hour. Avoid phones an hour before sleep." },
  { icon: Dumbbell, title: "Move daily", text: "Even 20 minutes of walking boosts mood, focus, and sleep quality." },
  { icon: Apple, title: "Eat mindfully", text: "Balanced meals fuel your brain. Hydrate often — dehydration causes fatigue." },
  { icon: Users, title: "Stay connected", text: "Talk to friends and family. Loneliness amplifies stress and burnout." },
  { icon: BookOpen, title: "Plan your day", text: "A simple to-do list reduces overwhelm and increases your sense of control." },
  { icon: Wind, title: "Breathe deeply", text: "5 minutes of deep breathing calms the nervous system and resets focus." },
];

function Tips() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Daily <span className="gradient-text">Wellness Tips</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Small daily habits that protect your energy, focus, and mental health.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tips.map((t) => (
            <div key={t.title} className="glass-card p-6 hover:translate-y-[-4px] transition">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-primary)" }}>
                <t.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
