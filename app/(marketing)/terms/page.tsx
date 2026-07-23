export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
      <p className="text-xs text-text-muted">Last Updated: July 2026</p>
      
      <div className="text-text-secondary text-xs leading-relaxed space-y-4">
        <p>
          Welcome to Vaylo AI. By registering an account and using our resume analyses, roadmap planners, and AI feedback services, you agree to comply with our usage guidelines.
        </p>

        <h3 className="text-base font-bold text-text-primary mt-6">1. Acceptable Use</h3>
        <p>
          You agree to use Vaylo AI responsibly. Scraping, reverse engineering, or exploiting backend AI routes is strictly prohibited.
        </p>

        <h3 className="text-base font-bold text-text-primary mt-6">2. Subscription Tiers</h3>
        <p>
          Subscription plans (Pro, Premium) grant you access to limits defined on the pricing page. Sharing accounts across multiple individuals is prohibited.
        </p>
      </div>
    </div>
  );
}
