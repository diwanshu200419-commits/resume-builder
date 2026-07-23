export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Refund Policy</h1>
      <p className="text-xs text-text-muted">Last Updated: July 2026</p>
      
      <div className="text-text-secondary text-xs leading-relaxed space-y-4">
        <p>
          We want you to be 100% satisfied with Vaylo AI.
        </p>

        <h3 className="text-base font-bold text-text-primary mt-6">1. Refund Eligibility</h3>
        <p>
          Since our AI services consume cloud computation tokens instantly upon analysis execution, refunds are eligible only for users who have not yet run any AI analysis or resume exports, within 7 days of subscription activation.
        </p>

        <h3 className="text-base font-bold text-text-primary mt-6">2. How to Request</h3>
        <p>
          Contact our support team at <strong>support@vaylo.ai</strong> with your account details and payment screenshot confirmation.
        </p>
      </div>
    </div>
  );
}
