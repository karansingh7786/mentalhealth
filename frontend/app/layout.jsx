import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MindAlert",
  description: "AI-Based Mental Fatigue & Stress Detection System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Dynamic Background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0d1117] to-black">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
