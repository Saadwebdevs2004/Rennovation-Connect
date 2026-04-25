"use client"

import { ClipboardList, Users, CheckCircle, Banknote, Search, FileText, Hammer, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const homeownerSteps = [
  {
    icon: ClipboardList,
    title: "Post Your Project",
    description: "Describe your renovation needs, set your budget, and upload photos of the work area.",
  },
  {
    icon: Users,
    title: "Receive Bids",
    description: "Get competitive bids from verified local professionals within 24 hours.",
  },
  {
    icon: CheckCircle,
    title: "Compare & Hire",
    description: "Review profiles, ratings, and quotes. Choose the best fit for your project.",
  },
  {
    icon: Banknote,
    title: "Pay Securely",
    description: "Use our secure payment system. Pay only when you're satisfied with the work.",
  },
]

const workerSteps = [
  {
    icon: Search,
    title: "Browse Jobs",
    description: "Find projects matching your skills and location with our smart job board.",
  },
  {
    icon: FileText,
    title: "Submit Bids",
    description: "Send competitive quotes with your estimated timeline and approach.",
  },
  {
    icon: Hammer,
    title: "Complete Work",
    description: "Get hired and complete the project to your high professional standards.",
  },
  {
    icon: Star,
    title: "Get Paid & Reviewed",
    description: "Receive secure payments and build your reputation with positive reviews.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
            Our Process
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Simple Process, <span className="text-primary">Exceptional</span> Results
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you&apos;re a homeowner seeking help or a professional looking for work, 
            our platform makes connections seamless and secure.
          </p>
        </div>

        <Tabs defaultValue="homeowner" className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="grid w-full max-w-lg grid-cols-2 p-1 bg-muted/30 backdrop-blur-sm rounded-full h-14">
              <TabsTrigger value="homeowner" className="rounded-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300">
                For Homeowners
              </TabsTrigger>
              <TabsTrigger value="worker" className="rounded-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300">
                For Professionals
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="homeowner" className="mt-0 focus-visible:outline-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {homeownerSteps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="worker" className="mt-0 focus-visible:outline-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workerSteps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function StepCard({ step, index }: { step: typeof homeownerSteps[0]; index: number }) {
  const Icon = step.icon
  return (
    <div className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
      {/* Connector Line */}
      {index < 3 && (
        <div className="hidden lg:block absolute top-12 left-[calc(100%-2rem)] w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent z-0" />
      )}
      
      <div className="relative z-10 bg-card/50 backdrop-blur-sm rounded-[32px] border border-border/50 p-8 hover:border-primary/50 hover:shadow-[0_20px_50px_oklch(0.5_0.18_250/0.1)] transition-all duration-500 h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xl transition-all duration-500">
            <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-all duration-500" />
          </div>
          <span className="text-5xl font-black text-muted-foreground/5 group-hover:text-primary/5 transition-colors duration-500 italic">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
      </div>
    </div>
  )
}
