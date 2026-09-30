import { Moon, Coffee, Eye, Heart, Sun, ActivitySquare } from "lucide-react";

export default function Tips() {
  const tips = [
    {
      title: "Optimize Sleep",
      icon: <Moon className="w-6 h-6" />,
      color: "text-indigo-600 bg-indigo-100",
      desc: "Maintain a consistent sleep schedule. Aim for 7-9 hours of uninterrupted rest to allow your brain to process the day's information."
    },
    {
      title: "The Pomodoro Technique",
      icon: <Coffee className="w-6 h-6" />,
      color: "text-amber-600 bg-amber-100",
      desc: "Work for 25 minutes, then take a 5-minute break. This prevents cognitive overload and keeps your focus sharp throughout the day."
    },
    {
      title: "Reduce Screen Fatigue",
      icon: <Eye className="w-6 h-6" />,
      color: "text-teal-600 bg-teal-100",
      desc: "Follow the 20-20-20 rule. Every 20 minutes, look at something 20 feet away for at least 20 seconds to reduce eye strain."
    },
    {
      title: "Stay Active",
      icon: <ActivitySquare className="w-6 h-6" />,
      color: "text-emerald-600 bg-emerald-100",
      desc: "Physical exercise increases blood flow to the brain, which enhances mood and cognitive performance. Try a 20-minute daily walk."
    },
    {
      title: "Mindfulness & Stress",
      icon: <Heart className="w-6 h-6" />,
      color: "text-rose-600 bg-rose-100",
      desc: "Take just 5 minutes a day for deep breathing or meditation. This simple practice significantly lowers cortisol (stress hormone) levels."
    },
    {
      title: "Get Sunlight",
      icon: <Sun className="w-6 h-6" />,
      color: "text-orange-600 bg-orange-100",
      desc: "Natural light, especially in the morning, regulates your circadian rhythm, improving your ability to fall asleep at night."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Mental Health Tips</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Small, daily habits compound over time. Adopt these scientifically proven practices to dramatically improve your focus and well-being.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tip.color}`}>
              {tip.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{tip.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
