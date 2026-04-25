import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustedBy } from "@/components/landing/trusted-by"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { Services } from "@/components/landing/services"
import { Gallery } from "@/components/landing/gallery"
import { Testimonials } from "@/components/landing/testimonials"
import { Stats } from "@/components/landing/stats"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustedBy />
        <HowItWorks />
        <Features />
        <Services />
        <Gallery />
        <Stats />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
