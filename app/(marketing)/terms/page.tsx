import Link from "next/link";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions — Vaylo AI",
  description: "Terms and conditions governing the use of Vaylo AI career copilot services.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-text-primary">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="border-b border-border pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms and Conditions</h1>
        <p className="text-xs text-text-muted">Effective Date: July 1, 2026 | Last Updated: August 2026</p>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed space-y-1">
        <p className="font-bold text-amber-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Important Career Assistance Disclaimer:
        </p>
        <p>
          Vaylo AI provides AI-powered career optimization tools. Vaylo AI does <strong>NOT</strong> guarantee job placement, employment offers, interview calls, specific ATS scores, or target salary increases. All AI recommendations are advisory tools designed to assist your application preparation.
        </p>
      </div>

      <div className="space-y-8 text-xs text-text-secondary leading-relaxed font-normal">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">1. Introduction</h2>
          <p>
            Welcome to Vaylo AI. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Vaylo AI website (https://www.vayloai.online), mobile applications, APIs, and associated career copilot services. By creating an account or using Vaylo AI, you agree to be bound by these Terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">2. Eligibility</h2>
          <p>
            You must be at least 18 years of age or the age of legal majority in your jurisdiction to create an account and purchase subscription plans on Vaylo AI.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">3. Account Creation &amp; Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. Sharing account access, credentials, or API usage across multiple individuals is strictly prohibited.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">4. User Responsibilities</h2>
          <p>
            You agree that all information provided in your resume, job applications, and career profiles is accurate, truthful, and representative of your professional qualifications.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">5. AI-Generated Content</h2>
          <p>
            Vaylo AI utilizes automated machine learning models (including Google Gemini AI) to assist with resume rewriting, ATS evaluation, cover letter generation, and interview preparation. You are responsible for reviewing and verifying all AI-generated text before submitting it to prospective employers.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">6. Resume Ownership</h2>
          <p>
            You retain 100% full ownership and intellectual property rights over your uploaded resumes, work history, and personal application records. Vaylo AI does not claim ownership over your personal data.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">7. User-Generated Content</h2>
          <p>
            By uploading documents or text to Vaylo AI, you grant Vaylo AI a limited, non-exclusive license to store and process the content solely for providing AI career services to your account.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">8. Acceptable Use</h2>
          <p>
            Vaylo AI is provided solely for personal career development and job application preparation. You agree to use the service in compliance with all applicable laws and regulations.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">9. Prohibited Activities</h2>
          <p>
            You shall not: (a) reverse engineer or scrape Vaylo AI APIs; (b) attempt to bypass feature entitlement controls or devtools guards; (c) upload malicious scripts; or (d) resell account access to third parties.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">10. Subscription Plans</h2>
          <p>
            Vaylo AI offers Free (₹0), Pro (₹99/month), Premium (₹299/month), and Career Pack (₹499 one-time) plans. Plan features and limits are specified on the Pricing page.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">11. Billing &amp; Payment Processing</h2>
          <p>
            Payments are processed securely via authorized Indian UPI and merchant payment gateways. All transaction amounts are in Indian Rupees (INR).
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">12. Recurring Subscriptions</h2>
          <p>
            Monthly plans (Pro ₹99/mo, Premium ₹299/mo) are billed on a 30-day recurring interval unless cancelled prior to the renewal date.
          </p>
        </section>

        {/* Section 13 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">13. Cancellation</h2>
          <p>
            You may cancel your subscription at any time via your Account Settings. Upon cancellation, you retain access to paid features until the end of your current billing period.
          </p>
        </section>

        {/* Section 14 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">14. Refund Policy</h2>
          <p>
            Refund eligibility depends on whether paid AI processing features or unwatermarked exports have already been executed on your account. Please review our complete <Link href="/refund" className="text-indigo-400 underline font-semibold">Refund Policy</Link> for detailed criteria.
          </p>
        </section>

        {/* Section 15 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">15. AI Limitations &amp; Output Disclaimer</h2>
          <p>
            AI recommendations are probabilistic suggestions based on automated language processing. Vaylo AI makes no representation that AI outputs are free from errors or omissions.
          </p>
        </section>

        {/* Section 16 */}
        <section className="space-y-2 font-semibold text-text-primary">
          <h2 className="text-base font-bold">16. No Employment Guarantee</h2>
          <p className="text-text-secondary font-normal">
            Vaylo AI is a self-service career assistance software. Vaylo AI does NOT guarantee employment, hiring decisions, or job offers from any employer or recruiting agency.
          </p>
        </section>

        {/* Section 17 */}
        <section className="space-y-2 font-semibold text-text-primary">
          <h2 className="text-base font-bold">17. No Guarantee of ATS Score Performance</h2>
          <p className="text-text-secondary font-normal">
            ATS match scores represent algorithmic similarity metrics. Vaylo AI does NOT guarantee that specific ATS scores will pass third-party proprietary employer Applicant Tracking Systems.
          </p>
        </section>

        {/* Section 18 */}
        <section className="space-y-2 font-semibold text-text-primary">
          <h2 className="text-base font-bold">18. No Guarantee of Job Interviews</h2>
          <p className="text-text-secondary font-normal">
            Interview selection depends entirely on external employer evaluation. Using Vaylo AI does NOT guarantee interview invitations.
          </p>
        </section>

        {/* Section 19 */}
        <section className="space-y-2 font-semibold text-text-primary">
          <h2 className="text-base font-bold">19. No Guarantee of Job Placement or Salary</h2>
          <p className="text-text-secondary font-normal">
            Vaylo AI does NOT guarantee job placement, salary negotiation outcomes, or specific compensation offers.
          </p>
        </section>

        {/* Section 20 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">20. Third-Party Services</h2>
          <p>
            Vaylo AI integrates with third-party infrastructure providers (Supabase for authentication/storage, Google AI for language models). Use of third-party features is subject to their respective terms.
          </p>
        </section>

        {/* Section 21 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">21. Service Availability &amp; Maintenance</h2>
          <p>
            While we strive for maximum uptime, Vaylo AI services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without guarantee of uninterrupted availability.
          </p>
        </section>

        {/* Section 22 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">22. Intellectual Property</h2>
          <p>
            The Vaylo AI software, branding, UI components, codebases, and logos are the property of Vaylo AI and protected by intellectual property laws.
          </p>
        </section>

        {/* Section 23 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">23. Account Termination</h2>
          <p>
            Vaylo AI reserves the right to suspend or terminate accounts that violate prohibited usage rules or engage in fraudulent activity.
          </p>
        </section>

        {/* Section 24 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">24. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Vaylo AI shall not be liable for indirect, incidental, or consequential damages resulting from your use of the platform.
          </p>
        </section>

        {/* Section 25 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary">25. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued use of Vaylo AI following changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* Section 26 */}
        <section className="space-y-2 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">26. Contact Information</h2>
          <p>
            If you have any questions regarding these Terms, please contact our support team:
          </p>
          <div className="flex items-center gap-1.5 font-medium text-indigo-400">
            <Mail className="w-4 h-4" /> support@vaylo.ai
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-border text-center text-xs text-text-muted">
        <p>© {new Date().getFullYear()} Vaylo AI. All rights reserved.</p>
      </div>
    </div>
  );
}
