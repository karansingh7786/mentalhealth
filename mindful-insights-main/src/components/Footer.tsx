import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span>MindAlert © {new Date().getFullYear()}</span>
        </div>
        <p>Built with care for student wellbeing.</p>
      </div>
    </footer>
  );
}
