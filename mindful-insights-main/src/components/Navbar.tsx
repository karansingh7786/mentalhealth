import { Link } from "@tanstack/react-router";
import { Brain, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/tips", label: "Tips" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">MindAlert</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
              activeProps={{ className: "px-4 py-2 rounded-lg text-sm text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="ml-2 btn-primary text-sm hover:[transform:translateY(-2px)]">
            Login
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-1 bg-background/90">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-muted">
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2 text-sm">Login</Link>
        </div>
      )}
    </header>
  );
}
