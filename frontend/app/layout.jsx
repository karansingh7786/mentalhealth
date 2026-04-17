import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MindAlert",
  description: "AI-Based Mental Fatigue & Stress Detection System",
};

const Navbar = () => (
  <nav className="sticky top-0 z-50 glass-panel !rounded-none border-t-0 border-x-0 border-b border-slate-200/50 bg-white/80">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg text-white flex items-center justify-center font-bold text-xl">M</div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">MindAlert</span>
          </Link>
          <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">Home</Link>
            <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">About</Link>
            <Link href="/tips" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">Tips</Link>
            <Link href="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">Contact</Link>
          </div>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-600 shadow-sm transition-colors">Login / Signup</Link>
        </div>
      </div>
    </div>
  </nav>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Dynamic Light Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
