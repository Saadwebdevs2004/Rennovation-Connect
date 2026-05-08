import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Download, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const pressReleases = [
  {
    date: "Mar 15, 2024",
    title: "Renovation Connect Raises RS 10B Series B for Global Expansion",
    link: "#"
  },
  {
    date: "Jan 10, 2024",
    title: "New Study Shows Homeowners Save 20% on Average via Renovation Connect",
    link: "#"
  },
  {
    date: "Nov 22, 2023",
    title: "Renovation Connect Named One of the Most Innovative Startups of 2023",
    link: "#"
  }
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Press & Media</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Resources and news for journalists, media partners, and anyone interested in our story.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-card border border-border p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-muted-foreground mb-6">For press releases, interview requests, or high-res assets, please contact our PR team.</p>
              <Button variant="outline" asChild>
                <a href="mailto:press@renoconnect.com">
                  <Mail className="mr-2 w-4 h-4" />
                  Email PR Team
                </a>
              </Button>
            </div>
            <div className="bg-primary text-primary-foreground p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Press Kit</h2>
              <p className="text-primary-foreground/80 mb-6">Download our brand guidelines, logos, and executive headshots.</p>
              <Button variant="secondary" asChild>
                <a href="#">
                  <Download className="mr-2 w-4 h-4" />
                  Download Assets (15MB)
                </a>
              </Button>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((pr) => (
              <div key={pr.title} className="border-b border-border pb-6 flex justify-between items-start gap-4 group">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">{pr.date}</span>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{pr.title}</h3>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 bg-muted rounded-2xl border border-border text-center">
            <h2 className="text-2xl font-bold mb-2">About Renovation Connect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
              Renovation Connect is the world's leading platform for connecting homeowners with verified local tradespeople. Since 2020, we have facilitated over 500,000 successful home improvement projects across the globe.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
