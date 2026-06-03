"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BeforeAfterSlider } from "@/components/landing/before-after-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, ArrowRight, Building2, Home, Utensils, User, Maximize2, MapPin, ShieldCheck } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "all", label: "All Projects", icon: Sparkles },
  { id: "residential", label: "Residential", icon: Home },
  { id: "commercial", label: "Commercial", icon: Building2 },
  { id: "restaurants", label: "Restaurants", icon: Utensils },
]

const projects = [
  {
    id: 1,
    category: "residential",
    title: "The Obsidian Lounge",
    description: "Transforming a dated 90s living space into a minimalist glass masterpiece.",
    beforeImage: "/residential_living_before.webp",
    afterImage: "/residential_living_after.webp",
    specs: { client: "Private Residence", area: "1,200 sqft", location: "DHA Phase 6" }
  },
  {
    id: 2,
    category: "residential",
    title: "Monochrome Chef's Kitchen",
    description: "A complete overhaul focusing on ergonomic flow and high-end marble finishes.",
    beforeImage: "/residential_kitchen_before.webp",
    afterImage: "/residential_kitchen_after.webp",
    specs: { client: "Family Home", area: "450 sqft", location: "Gulberg III" }
  },
  {
    id: 3,
    category: "residential",
    title: "The Marble Oasis",
    description: "Converting a cramped ensuite into a spa-inspired sanctuary with floating vanities.",
    beforeImage: "/bathroom_spa_before.png",
    afterImage: "/bathroom_spa_after.png",
    specs: { client: "Luxury Apartment", area: "220 sqft", location: "Bahria Town" }
  },
  {
    id: 4,
    category: "commercial",
    title: "TechFlow Workspace",
    description: "Industrial warehouse conversion into a vibrant, high-tech collaborative office.",
    beforeImage: "/commercial_office_before.webp",
    afterImage: "/commercial_office_after.webp",
    specs: { client: "SaaS Solutions", area: "3,500 sqft", location: "Johar Town" }
  },
  {
    id: 5,
    category: "commercial",
    title: "Skyline Innovation Hub",
    description: "A high-altitude office renovation focused on panoramic views and open-plan flow.",
    beforeImage: "/commercial_office_before.webp",
    afterImage: "/renovation_masterpiece_gallery_1777067891424.webp",
    specs: { client: "Nexus Corp", area: "5,200 sqft", location: "Main Boulevard" }
  },
  {
    id: 6,
    category: "commercial",
    title: "The Creative Nexus",
    description: "Transforming an old retail unit into a modern architectural studio.",
    beforeImage: "/commercial_office_before.webp",
    afterImage: "/hero-image.webp",
    specs: { client: "Design Collective", area: "1,800 sqft", location: "Model Town" }
  },
  {
    id: 7,
    category: "restaurants",
    title: "The Copper Bistro",
    description: "Converting a cramped kitchen into a high-capacity gourmet culinary center.",
    beforeImage: "/residential_kitchen_before.webp",
    afterImage: "/residential_kitchen_after.webp",
    specs: { client: "Copper Hospitality", area: "800 sqft", location: "Gulberg Main" }
  },
  {
    id: 8,
    category: "restaurants",
    title: "Vibe Dining Lounge",
    description: "Modernizing a traditional eatery with sleek lighting and open-concept dining.",
    beforeImage: "/restaurant_rustic_before.png",
    afterImage: "/restaurant_rustic_after.png",
    specs: { client: "Vibe Group", area: "1,400 sqft", location: "DHA Phase 5" }
  },
  {
    id: 9,
    category: "restaurants",
    title: "The Rustic Table",
    description: "A heritage building restoration turned into a cozy, high-end farm-to-table restaurant.",
    beforeImage: "/restaurant_rustic_before.png",
    afterImage: "/restaurant_rustic_after.png",
    specs: { client: "Artisan Eats", area: "2,100 sqft", location: "Old City" }
  },
]

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Premium Ambient Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* Decorative Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-45 pointer-events-none -z-20" />

      <Header />

      <main className="flex-1 pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in-up">
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary px-5 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full shadow-sm animate-pulse">
              🏆 Architectural Masterpieces
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
              Visualizing the <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Transformation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
              Explore our record of excellence. Slide between the past and present to witness the power of professional architectural renovation and structural mastery.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex justify-center mb-24 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Tabs defaultValue="all" className="w-auto" onValueChange={setActiveCategory}>
              <TabsList className="bg-white/75 dark:bg-muted/30 backdrop-blur-md p-1.5 rounded-full border border-border/80 h-auto shadow-lg shadow-black/[0.03]">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="rounded-full px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    <span className="font-bold tracking-wide text-xs uppercase">{cat.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-40">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="grid lg:grid-cols-12 gap-16 items-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Visual Showcase */}
                <div className="lg:col-span-8 group/slider relative rounded-[40px] p-2 bg-gradient-to-tr from-border/50 via-border/10 to-border/50 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
                  <div className="rounded-[38px] overflow-hidden bg-background">
                    <BeforeAfterSlider
                      beforeImage={project.beforeImage}
                      afterImage={project.afterImage}
                      title={project.title}
                      description={project.description}
                      category={project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    />
                  </div>
                </div>

                {/* Technical Specs (Archi-Cubes Style) */}
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                  <div className="bg-white/95 dark:bg-card/98 rounded-[40px] border border-border/60 p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:border-primary/30 transition-all duration-500 group/card">
                    <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-5">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                        Project Specifications
                      </h4>
                      <Badge className="bg-primary/10 hover:bg-primary/10 text-primary border-primary/20 font-extrabold uppercase text-[9px] px-2 py-0.5 rounded-sm animate-in zoom-in duration-500">
                        Verified
                      </Badge>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Client Row */}
                      <div className="flex justify-between items-center group/row py-1 border-b border-border/20">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2 group-hover/row:text-primary transition-colors">
                          <User className="w-3.5 h-3.5" />
                          Client
                        </span>
                        <span className="font-extrabold text-foreground text-sm tracking-tight">{project.specs.client}</span>
                      </div>

                      {/* Area Row */}
                      <div className="flex justify-between items-center group/row py-1 border-b border-border/20">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2 group-hover/row:text-primary transition-colors">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Area
                        </span>
                        <span className="font-extrabold text-foreground text-sm tracking-tight">{project.specs.area}</span>
                      </div>

                      {/* Location Row */}
                      <div className="flex justify-between items-center group/row py-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-2 group-hover/row:text-primary transition-colors">
                          <MapPin className="w-3.5 h-3.5" />
                          Location
                        </span>
                        <span className="font-extrabold text-foreground text-sm tracking-tight">{project.specs.location}</span>
                      </div>
                    </div>

                    <div className="pt-10">
                      <Button className="w-full h-14 rounded-full font-extrabold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] group transition-all duration-300 bg-primary hover:bg-primary/95 text-primary-foreground" asChild>
                        <Link href="/register">
                          Start a Similar Project
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="p-7 rounded-[32px] bg-primary/[0.04] dark:bg-primary/[0.06] border border-primary/10 relative overflow-hidden group/box">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/45 group-hover/box:h-full transition-all duration-500" />
                    <p className="text-xs text-muted-foreground font-semibold leading-relaxed pl-2">
                      This build exhibits our unwavering dedication to architectural elegance, structural perfection, and eco-friendly design frameworks.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-40 p-16 lg:p-24 rounded-[50px] bg-foreground text-background text-center relative overflow-hidden group/cta shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.62_0.19_250/0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),transparent)] pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full inline-block">
                Start Your Journey
              </span>
              <h2 className="text-4xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight">Ready to write your own <br /> transformation story?</h2>
              <p className="text-base lg:text-lg text-muted-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
                Connect with our premium network of architectural experts and certified structural workers. Let's make your dream renovation a reality.
              </p>
              <div className="pt-6">
                <Button size="lg" className="rounded-full px-12 h-16 bg-white text-foreground hover:bg-white/90 font-extrabold text-base shadow-2xl transition-all hover:scale-105" asChild>
                  <Link href="/register">Post Your Project Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
