import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-text-primary">
              Vaylo<span className="text-accent">AI</span>
            </Link>
            <p className="mt-3 text-text-secondary text-sm max-w-sm">
              Your AI Career Copilot — AI-powered career platform for resumes, interviews, and growth.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/#features" className="hover:text-text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/signup" className="hover:text-text-primary transition-colors">Get started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="#" className="hover:text-text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-muted">
          © {new Date().getFullYear()} Vaylo AI. Built with Next.js • Supabase • Gemini AI
        </div>
      </div>
    </footer>
  );
}
