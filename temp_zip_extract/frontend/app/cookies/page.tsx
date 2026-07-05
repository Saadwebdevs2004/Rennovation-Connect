import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: March 20, 2024</p>
          
          <section className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              Renovation Connect uses cookies to improve your experience on our platform.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">What are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and keep you logged in.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">How We Use Cookies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function correctly.</li>
              <li><strong>Analytical Cookies:</strong> Help us understand how visitors use our site.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings like currency or language.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">Managing Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings. However, disabling cookies may affect the functionality of our platform.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
