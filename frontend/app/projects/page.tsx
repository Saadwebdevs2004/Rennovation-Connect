"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BeforeAfterSlider } from "@/components/landing/before-after-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, ArrowRight, Building2, Home, Utensils } from "lucide-react"
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
    beforeImage: "/residential_kitchen_before.webp",
    afterImage: "/modern_bathroom_service_1777068274636.webp",
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
    beforeImage: "/residential_living_before.webp",
    afterImage: "/modern_kitchen_service_1777068298704.webp",
    specs: { client: "Vibe Group", area: "1,400 sqft", location: "DHA Phase 5" }
  },
  {
    id: 9,
    category: "restaurants",
    title: "The Rustic Table",
    description: "A heritage building restoration turned into a cozy, high-end farm-to-table restaurant.",
    beforeImage: "/residential_living_before.webp",
    afterImage: "/happy_homeowner_renovated_space_1777068461287.webp",
    specs: { client: "Artisan Eats", area: "2,100 sqft", location: "Old City" }
  },
]

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
            <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 text-primary px-4 py-1 font-black uppercase tracking-widest text-[10px]">
              Portfolio Showcase
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-8">
              Visualizing the <span className="text-primary">Transformation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our record of excellence. Slide between the past and present to witness the power of professional renovation.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex justify-center mb-16 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Tabs defaultValue="all" className="w-auto" onValueChange={setActiveCategory}>
              <TabsList className="bg-muted/30 p-1 rounded-full border border-border/50 h-auto">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    <span className="font-bold">{cat.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-32">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="grid lg:grid-cols-12 gap-12 items-start animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Visual Showcase */}
                <div className="lg:col-span-8">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    title={project.title}
                    description={project.description}
                    category={project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  />
                </div>

                {/* Technical Specs (Archi-Cubes Style) */}
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                  <div className="glass rounded-[40px] border border-border/50 p-10">
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-8 border-b border-primary/10 pb-4">
                      Project Specs
                    </h4>
                    <div className="space-y-6">
                      {Object.entries(project.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center group">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{key}</span>
                          <span className="font-bold text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-10">
                      <Button className="w-full h-14 rounded-full font-bold shadow-xl shadow-primary/20 group" asChild>
                        <Link href="/register">
                          Start a Similar Project
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10">
                    <p className="text-sm text-primary/80 font-medium leading-relaxed">
                      This project highlights our commitment to detail, architectural integrity, and modern design standards.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-32 p-20 rounded-[64px] bg-foreground text-background text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,oklch(0.5_0.18_250/0.4),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8">Ready to write your own <br /> transformation story?</h2>
              <Button size="lg" className="rounded-full px-12 h-16 bg-white text-foreground hover:bg-white/90 font-bold text-lg shadow-2xl" asChild>
                <Link href="/register">Post Your Project Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
