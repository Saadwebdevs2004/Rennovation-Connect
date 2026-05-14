import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Homeowner",
    price: "Free",
    description: "Perfect for finding local tradespeople",
    features: [
      "Post unlimited projects",
      "Receive bids from verified pros",
      "Secure messaging",
      "Safe payments",
      "Review professionals"
    ],
    cta: "Post a Job",
    href: "/register?role=homeowner"
  },
  {
    name: "Professional",
    price: "RS 2,500",
    period: "/month",
    description: "Grow your business with quality leads",
    features: [
      "Access to all local jobs",
      "Professional profile page",
      "Unlimited bidding",
      "Priority in search results",
      "Analytics dashboard"
    ],
    cta: "Join as a Pro",
    href: "/register?role=worker",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large construction firms",
    features: [
      "Multiple user accounts",
      "Dedicated account manager",
      "Custom API access",
      "Advanced reporting",
      "Batch job posting"
    ],
    cta: "Contact Sales",
    href: "/contact"
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. No hidden fees, ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-card rounded-2xl p-8 border ${plan.popular ? 'border-primary shadow-xl ring-1 ring-primary' : 'border-border'} flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-muted-foreground mb-8 text-sm">{plan.description}</p>
              
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className="w-full h-12 text-base font-semibold"
                asChild
              >
                <a href={plan.href}>{plan.cta}</a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center bg-muted/30 rounded-2xl p-8 border border-border">
          <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
          <div className="space-y-6 text-left mt-8">
            <div>
              <p className="font-medium">Are there any project success fees?</p>
              <p className="text-muted-foreground text-sm">We don't take a cut of your earnings. Professionals pay a flat monthly subscription to access the platform.</p>
            </div>
            <div>
              <p className="font-medium">Can I cancel my subscription anytime?</p>
              <p className="text-muted-foreground text-sm">Yes, you can cancel your Professional plan at any time from your settings page.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
