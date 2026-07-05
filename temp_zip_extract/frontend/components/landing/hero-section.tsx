"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Star, CheckCircle2, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 mesh-gradient">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,oklch(0.5_0.18_250/0.15),transparent_70%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0.18_250/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0.18_250/0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Floating Blobs */}
      <div className="absolute top-1/4 left-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-glow animation-delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary animate-fade-in">
              <Zap className="w-3 h-3 mr-2 fill-primary" />
              The #1 Renovation Platform
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight animate-fade-in-up">
              Revitalize Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient">
                Living Space
              </span>
            </h1>

            <p className="mt-8 text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up animation-delay-200">
              Connect with elite, verified professionals for your next home project. 
              Seamless hiring, secure payments, and world-class results.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
              <Button size="lg" asChild className="text-base px-10 h-14 bg-primary hover:bg-primary/90 shadow-[0_20px_50px_oklch(0.5_0.18_250/0.3)] transition-all duration-300 rounded-full">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 animate-fade-in animation-delay-600 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Verified Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Secure Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Project Insurance</span>
              </div>
            </div>
          </div>

          {/* Right Content - Modern Image Frame */}
          <div className="relative z-10 animate-scale-in animation-delay-200">
            <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto lg:ml-auto">
              {/* Glass Card Underneath */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[40px] blur-2xl opacity-50" />
              
              {/* Main Image Container */}
              <div className="relative h-full w-full rounded-[32px] overflow-hidden border border-white/20 shadow-2xl animate-float">
                <Image
                  src="/hero-image.webp"
                  alt="Modern Home Renovation"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                
                {/* Floating Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl border border-white/20 animate-fade-in animation-delay-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                          <Image src={`/placeholder-user.webp`} alt="User" width={40} height={40} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="w-4 h-4 fill-warning" />
                      <span className="text-sm font-bold text-foreground">4.9/5</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Join 50,000+ satisfied homeowners</p>
                  <p className="text-xs text-muted-foreground mt-1">Trusted professionals at your fingertips</p>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
