import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: March 20, 2024</p>
          
          <section className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              At Renovation Connect, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, post a job, or submit a bid. This includes your name, email address, phone number, and any project details you share.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
            <p>
              We use your information to facilitate connections between homeowners and professionals, process payments, and improve our services. We do not sell your personal data to third parties.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time through your account settings.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
