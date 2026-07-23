export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
      <p className="text-xs text-text-muted">Last Updated: July 2026</p>
      
      <div className="text-text-secondary text-xs leading-relaxed space-y-4">
        <p>
          At Vaylo AI, we prioritize the confidentiality of your career records. This policy describes how we collect, store, and process your resume and profile data.
        </p>

        <h3 className="text-base font-bold text-text-primary mt-6">1. Information We Collect</h3>
        <p>
          We store profile information (email address, full name), payment UTR IDs, and uploaded resume text necessary to generate ATS optimization feedback and matching scores.
        </p>

        <h3 className="text-base font-bold text-text-primary mt-6">2. Data Security &amp; AI Processing</h3>
        <p>
          All resume content is analyzed securely using the Google Gemini API. We do not sell your personal files or resume content to third-party advertisers.
        </p>
      </div>
    </div>
  );
}
