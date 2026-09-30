import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-panel !rounded-none border-t-0 border-x-0 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg text-white flex items-center justify-center font-bold text-xl">M</div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">MindAlert</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">Home</Link>
              <Link to="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">About</Link>
              <Link to="/tips" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">Tips</Link>
              <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-slate-900">Contact</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-600 shadow-sm transition-colors">Login / Signup</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
