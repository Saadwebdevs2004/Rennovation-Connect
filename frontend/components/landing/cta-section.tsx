"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Wrench, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-card/50 backdrop-blur-xl rounded-[48px] border border-border/50 overflow-hidden shadow-[0_32px_64px_oklch(0_0_0/0.05)]">
          <div className="grid lg:grid-cols-2 items-stretch">
            {/* Left Content */}
            <div className="p-8 lg:p-20 flex flex-col justify-center animate-fade-in-up">
              <Badge variant="outline" className="w-fit mb-8 border-primary/20 bg-primary/5 text-primary px-6 py-2 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Your Dream Home Awaits
              </Badge>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
                Ready to <span className="text-primary">Transform</span> <br/>
                Your Space?
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-medium">
                Join thousands of homeowners who have found their perfect tradesperson. 
                Experience the ease of elite renovations today.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button size="lg" asChild className="text-base px-10 h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-full transition-all duration-300">
                  <Link href="/register?role=homeowner" className="font-bold">
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild className="text-base px-10 h-14 rounded-full font-bold hover:bg-primary/5 transition-all duration-300">
                  <Link href="/register?role=worker">
                    Join as a Professional
                  </Link>
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-6 pt-12 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-foreground">50k+</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Users</p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div>
                  <p className="text-2xl font-bold text-foreground">4.9/5</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rating</p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div>
                  <p className="text-2xl font-bold text-foreground">24/7</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Support</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative min-h-[400px] lg:min-h-full overflow-hidden group">
              <img 
                src="/happy_homeowner_renovated_space_1777068461287.png" 
                alt="Happy Homeowner in Renovated Space" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-card/20 to-transparent lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-card/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
