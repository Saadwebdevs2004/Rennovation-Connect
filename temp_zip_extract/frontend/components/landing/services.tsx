"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface ServiceItem {
  image?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  projects: string;
}

const services: ServiceItem[] = [
  {
    image: "/modern_plumbing_service_1777067810101.webp",
    title: "Plumbing",
    description: "Expert leak repairs, luxury installs, and piping",
    projects: "12,450+",
  },
  {
    image: "/modern_electrical_service_1777067830350.webp",
    title: "Electrical",
    description: "Smart systems, lighting design, and safety",
    projects: "9,820+",
  },
  {
    image: "/modern_painting_service_1777067851534.webp",
    title: "Painting",
    description: "Premium interior and exterior finishes",
    projects: "15,670+",
  },
  {
    image: "/modern_carpentry_service_1777067868711.webp",
    title: "Carpentry",
    description: "Custom builds and exquisite woodwork",
    projects: "8,340+",
  },
  {
    image: "/modern_roofing_service_1777068229672.webp",
    title: "Roofing",
    description: "Expert repairs, replacements, and inspections",
    projects: "5,230+",
  },
  {
    image: "/modern_hvac_service_1777068251264.webp",
    title: "HVAC",
    description: "Heating, cooling, and smart climate control",
    projects: "7,890+",
  },
  {
    image: "/modern_bathroom_service_1777068274636.webp",
    title: "Bathroom",
    description: "Luxury remodeling and complete renovations",
    projects: "6,540+",
  },
  {
    image: "/modern_kitchen_service_1777068298704.webp",
    title: "Kitchen",
    description: "Modern remodeling and gourmet upgrades",
    projects: "4,980+",
  },
]

export function Services() {
  return (
    <section id="services" className="py-16 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="max-w-2xl animate-fade-in-up">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
              Our Expertise
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Professional Services for <br/>
              <span className="text-primary">Every Need</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find elite, background-checked specialists across all major renovation and repair categories.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-card/90 dark:bg-card/95 rounded-[32px] border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-[0_20px_50px_oklch(0.5_0.18_250/0.1)] transition-all duration-700 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                {service.image ? (
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-5xl">
                    {service.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm h-10 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 mb-1">Impact</span>
                    <p className="text-xs font-bold text-primary">
                      {service.projects} Projects
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
