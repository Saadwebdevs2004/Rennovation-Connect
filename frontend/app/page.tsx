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
    <div className="dark relative min-h-screen text-foreground bg-background">
      {/* Content wrapper with relative positioning so it sits above the fixed canvas */}
      <div className="relative z-10 w-full h-full flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection />

          {/* Other sections with transparent/glassmorphic backgrounds so the canvas shows through */}
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
    </div>
  )
}
