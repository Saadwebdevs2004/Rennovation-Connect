import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: March 20, 2024</p>
          
          <section className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              By using Renovation Connect, you agree to the following terms and conditions.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. User Responsibilities</h2>
            <p>
              Homeowners are responsible for providing accurate project details. Professionals are responsible for providing honest bids and quality workmanship.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Payments</h2>
            <p>
              Payments made through the platform are subject to our payment processing terms. Renovation Connect is not responsible for disputes regarding the quality of work performed.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Limitation of Liability</h2>
            <p>
              Renovation Connect acts as a marketplace to connect parties. We are not liable for any damages arising from projects facilitated through our platform.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
