"use client";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact Form */}
        <div className="glass-panel bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Get in Touch</h1>
            <p className="text-slate-500">Have a question or facing an issue? Let us know!</p>
          </div>

          {sent ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button disabled={loading} className="w-full mt-2 bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="flex flex-col gap-6 pt-4 lg:pt-12">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageCircle className="text-primary w-6 h-6" /> FAQ
            </h2>
            <p className="text-slate-500">Common questions about MindAlert.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-800 mb-2">How accurate is the fatigue detection?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">MindAlert acts as a screening guide rather than a clinical diagnostic tool. It uses established health heuristics combined with Google Gemini's NLP assessment to provide educated estimates and actionable health guidance.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-800 mb-2">Is my data private?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">Yes. Your daily metrics are tied to your user ID and stored securely. We do not share your sleep or stress habits with any third parties outside of our AI ingestion pipeline for insight generation.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-800 mb-2">Can I contact my school counselor through this app?</h4>
            <p className="text-slate-600 text-sm leading-relaxed">Currently, MindAlert is a standalone self-assessment tool. We highly encourage you to manually share your generated metrics with your guidance counselor if you are feeling overwhelmed.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
