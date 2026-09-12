import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Metrics } from "@/components/landing/Metrics";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RoleGuideLinks } from "@/components/landing/RoleGuideLinks";
import { BeforeAfterDemo } from "@/components/landing/BeforeAfterDemo";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTABanner } from "@/components/landing/CTABanner";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Metrics />
        <Features />
        <HowItWorks />
        <RoleGuideLinks />
        <BeforeAfterDemo />
        <Testimonials />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
