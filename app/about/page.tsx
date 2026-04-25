import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Users, Shield, Target, Award } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We verify every professional on our platform to ensure quality and safety for homeowners."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Building local connections between skilled tradespeople and the neighbors who need them."
  },
  {
    icon: Target,
    title: "Quality First",
    description: "We prioritize excellence in craftsmanship and customer service above all else."
  },
  {
    icon: Award,
    title: "Professional Growth",
    description: "Empowering independent tradespeople with the tools they need to build their business."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">Our Mission</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are on a mission to simplify home renovations. By connecting homeowners with the best local tradespeople, we're making quality construction accessible, transparent, and stress-free.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Renovation Connect Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, Renovation Connect started with a simple observation: finding a reliable plumber or electrician shouldn't be a gamble.
                </p>
                <p>
                  Our founders, former contractors themselves, saw the frustration homeowners felt when trying to get fair bids, and the struggle skilled pros faced when looking for quality work without expensive marketing budgets.
                </p>
                <p>
                  We built this platform to bridge that gap. Today, Renovation Connect is home to over 50,000 verified professionals and has helped hundreds of thousands of homeowners complete their dream projects.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">Team Photo</div>
              </div>
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden translate-y-8">
                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/50 font-bold">Office View</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="bg-card p-8 rounded-2xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
