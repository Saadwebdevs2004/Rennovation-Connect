"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Gallery() {
  return (
    <section id="projects" className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 text-primary">
              Transformation Showcase
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
              Visualize Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Dream Home</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Explore our curated collection of breathtaking renovations. From minimalist penthouses to modern culinary centers, see what&apos;s possible.
            </p>
            
            <div className="space-y-6 mb-10">
              {[
                "Award-winning architectural designs",
                "Sustainable and eco-friendly materials",
                "Smart home integration at its finest",
                "Meticulous attention to every detail"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
              >
                View Full Portfolio
              </Link>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-border bg-background font-bold hover:bg-muted transition-all"
              >
                Start Your Project
              </Link>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {/* Main Image Frame */}
            <div className="relative z-10 rounded-[40px] overflow-hidden border border-white/10 shadow-[0_32px_64px_oklch(0_0_0/0.15)] aspect-[4/5] lg:aspect-square">
              <img 
                src="/residential_living_after.png" 
                alt="Modern Renovation Masterpiece" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Glass Info Card */}
              <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl border border-white/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Project Highlight</p>
                    <h4 className="text-white text-xl font-bold">The Obsidian Penthouse</h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />
          </div>
        </div>
      </div>
    </section>
  )
}
