"use client"

import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  MessageSquare, 
  CreditCard, 
  Clock, 
  BarChart3, 
  Bell,
  MapPin,
  FileCheck
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All tradespeople undergo thorough background checks, license verification, and insurance validation.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description: "Communicate directly with professionals through our secure in-app messaging system.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Protected payments held in escrow until you approve the completed work.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "Receive multiple bids within 24 hours of posting your project.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: BarChart3,
    title: "Price Transparency",
    description: "Compare quotes side-by-side and understand exactly what you're paying for.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay updated with instant alerts for new bids, messages, and project milestones.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MapPin,
    title: "Local Matching",
    description: "Get matched with qualified professionals in your specific area.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: FileCheck,
    title: "Project Management",
    description: "Track progress, manage timelines, and keep all documents in one place.",
    color: "text-success",
    bg: "bg-success/10",
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 lg:py-32 bg-muted/20 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
            Platform Benefits
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Powerful tools designed to make hiring professionals and finding work easier, safer, and more transparent.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative bg-card/90 dark:bg-card/95 rounded-[24px] border border-border/50 p-8 hover:border-primary/50 hover:shadow-[0_20px_50px_oklch(0.5_0.18_250/0.1)] transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                
                {/* Decorative border bottom on hover */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
