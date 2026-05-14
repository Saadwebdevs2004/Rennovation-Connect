"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, MessageSquare, CheckCircle2, Info, Star, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React from "react"

const posts = [
  {
    slug: "spatial-harmony-open-concept",
    title: "The Art of Spatial Harmony: A Guide to Open-Concept Living (Baithak & Lounge)",
    category: "Interior Design",
    image: "/blog/living-room.webp",
    author: "Zainab Sheikh",
    date: "May 10, 2024",
    readTime: "8 min read",
    content: `
      <p class="text-xl leading-relaxed text-muted-foreground mb-10 font-light italic border-l-4 border-primary/20 pl-6">
        Open-concept living has redefined modern residential architecture in Pakistan, moving away from the compartmentalized 'Drawing Room' (Baithak) culture to a more fluid, integrated lifestyle.
      </p>
      
      <figure class="my-12 group">
        <div class="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl">
          <img src="/blog/living-room.webp" alt="Open Concept Living" class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
        </div>
        <figcaption class="text-center mt-6 text-sm text-muted-foreground italic font-light tracking-wide">
          A masterclass in balancing negative space and functional clusters in a modern Pakistani Lounge.
        </figcaption>
      </figure>

      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight flex items-center gap-3">
        <span class="text-primary/40 text-4xl">01</span> Defining Zones Without Walls
      </h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">
        The primary challenge of open-plan living is maintaining a sense of order. Use area rugs, lighting changes, and furniture placement to define the living area (Lounge), dining space, and Drawing Room (Baithak).
      </p>
      
      <div class="my-12 p-8 rounded-[2rem] bg-accent/5 border border-accent/20 relative overflow-hidden group">
        <h4 class="text-accent font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
          <ShieldCheck class="w-4 h-4" /> Design Secret
        </h4>
        <p class="text-foreground/80 leading-relaxed font-medium italic">
          "Use a double-height ceiling in the main Lounge area to create a psychological sense of 'Centrality' while keeping the Baithak ceiling at a standard height."
        </p>
      </div>

      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight flex items-center gap-3">
        <span class="text-primary/40 text-4xl">02</span> Cohesive Color Palettes (Rang)
      </h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">
        To make a large open space feel unified, stick to a consistent base color (Rang) palette. Use accents of deeper tones—like emerald green—to add depth to specific zones.
      </p>
    `
  },
  {
    slug: "luxury-kitchen-trends",
    title: "Culinary Sanctuaries: Trends in Luxury Kitchens (Bawarchi Khana)",
    category: "Renovation",
    image: "/blog/kitchen.webp",
    author: "Ahmed Khan",
    date: "May 8, 2024",
    readTime: "6 min read",
    content: `
      <p class="text-xl leading-relaxed text-muted-foreground mb-10 font-light italic border-l-4 border-primary/20 pl-6">
        The kitchen (Bawarchi Khana) is no longer just a place for meal preparation; it is the heart of the modern home.
      </p>
      
      <figure class="my-12">
        <div class="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl">
          <img src="/blog/kitchen.webp" alt="Luxury Kitchen Design" class="object-cover w-full h-full" />
        </div>
      </figure>

      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight flex items-center gap-3">
        <span class="text-primary/40 text-4xl">01</span> The Dirty Kitchen Concept
      </h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">
        A 'Dirty Kitchen' (Bawarchi Khana for heavy cooking) paired with a sleek main kitchen is the ultimate luxury.
      </p>
    `
  },
  {
    slug: "spa-bathroom-experience",
    title: "The Spa Revolution: Elevating Your Bathroom (Ghusal Khana)",
    category: "Luxury Living",
    image: "/blog/bathroom.webp",
    author: "Faiza Ahmed",
    date: "May 5, 2024",
    readTime: "5 min read",
    content: `
      <p class="text-xl leading-relaxed text-muted-foreground mb-10 font-light italic border-l-4 border-primary/20 pl-6">
        Transform your daily routine into a ritual with the latest in wellness design for your Bathroom (Ghusal Khana).
      </p>
      
      <figure class="my-12">
        <div class="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl">
          <img src="/blog/bathroom.webp" alt="Spa Bathroom" class="object-cover w-full h-full" />
        </div>
      </figure>

      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight flex items-center gap-3">
        <span class="text-primary/40 text-4xl">01</span> Hydrotherapy & Light
      </h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">
        Multiple showerheads and intelligent lighting (Roshni) are key to creating a sanctuary (Sukoon).
      </p>
    `
  },
  {
    slug: "smart-home-integration",
    title: "Smart Integration: The Future of Seamless Home Automation",
    category: "Technology",
    image: "/blog/smart-home.webp",
    author: "Usman Ali",
    date: "May 2, 2024",
    readTime: "7 min read",
    content: `
      <p class="text-xl leading-relaxed text-muted-foreground mb-10 font-light italic border-l-4 border-primary/20 pl-6">
        Beyond voice commands: how AI is creating homes that anticipate your needs.
      </p>
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Seamless Automation</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Integrated systems control everything from climate to security.</p>
    `
  },
  {
    slug: "sustainable-luxury-materials",
    title: "Sustainable Luxury: Eco-Conscious Materials (Lakri & Pathar)",
    category: "Sustainability",
    image: "/blog/sustainability.webp",
    author: "Hina Malik",
    date: "Apr 28, 2024",
    readTime: "9 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Natural Materials</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">A deep dive into reclaimed wood (Lakri) and stone (Pathar).</p>
    `
  },
  {
    slug: "indoor-outdoor-landscaping",
    title: "Curated Landscapes: Designing Your Outdoor Space (Sehan)",
    category: "Architecture",
    image: "/blog/landscaping.webp",
    author: "Bilal Shah",
    date: "Apr 25, 2024",
    readTime: "6 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 The Modern Sehan</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Designing outdoor living rooms that match your interior aesthetics.</p>
    `
  },
  {
    slug: "ultimate-home-office",
    title: "The Productive Retreat: Designing the Ultimate Home Office",
    category: "Home Office",
    image: "/blog/home-office.webp",
    author: "Sana Ijaz",
    date: "Apr 20, 2024",
    readTime: "5 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Ergonomics & Focus</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Creating a workspace that inspires productivity.</p>
    `
  },
  {
    slug: "lighting-impact-mood",
    title: "Illuminating Architecture: The Impact of Lighting (Roshni)",
    category: "Design Tips",
    image: "/blog/lighting.webp",
    author: "Hamza Butt",
    date: "Apr 15, 2024",
    readTime: "7 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Layers of Roshni</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Mastering ambient, task, and accent lighting.</p>
    `
  },
  {
    slug: "herringbone-flooring-appeal",
    title: "Foundations of Style: The Timeless Appeal of Herringbone Flooring (Farsh)",
    category: "Materials",
    image: "/blog/flooring.webp",
    author: "Maryam Jameel",
    date: "Apr 10, 2024",
    readTime: "4 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Timeless Patterns</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Why Herringbone remains the gold standard for luxury flooring (Farsh).</p>
    `
  },
  {
    slug: "psychology-of-color",
    title: "The Psychology of Color (Rang): Crafting a Sophisticated Palette",
    category: "Interior Design",
    image: "/blog/color-palette.webp",
    author: "Zeeshan Haider",
    date: "Apr 5, 2024",
    readTime: "8 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 The Power of Rang</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">How color affects emotion and spatial perception.</p>
    `
  },
  {
    slug: "small-space-solutions",
    title: "Compact Elegance: Solutions for Small Urban Spaces (Choti Jagah)",
    category: "Urban Living",
    image: "/blog/small-spaces.webp",
    author: "Amna Rehman",
    date: "Mar 30, 2024",
    readTime: "6 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Urban Efficiency</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">High-end solutions for compact city living (Choti Jagah).</p>
    `
  },
  {
    slug: "modern-dining-room-hosting",
    title: "The Formal Revival: Hosting in the Modern Dining Room",
    category: "Lifestyle",
    image: "/blog/dining-room.webp",
    author: "Farhan Saeed",
    date: "Mar 25, 2024",
    readTime: "5 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 Art of Hosting</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Designing spaces that facilitate conversation and celebration.</p>
    `
  },
  {
    slug: "modernizing-exterior-cladding",
    title: "Curb Appeal Reimagined: Modernizing Your Home's Exterior",
    category: "Renovation",
    image: "/blog/exterior.webp",
    author: "Rabia Bashir",
    date: "Mar 20, 2024",
    readTime: "7 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 First Impressions</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Transforming your home's exterior with modern cladding and light.</p>
    `
  },
  {
    slug: "master-bedroom-suite-luxury",
    title: "Private Sanctuaries: Creating a Luxury Master Bedroom (Kamra)",
    category: "Luxury Living",
    image: "/blog/bedroom.webp",
    author: "Omar Khalid",
    date: "Mar 15, 2024",
    readTime: "6 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 The Master Kamra</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Infusing hotel-inspired luxury into your private quarters.</p>
    `
  },
  {
    slug: "basement-potential-luxury",
    title: "Subterranean Luxury: Maximizing Your Basement (Tehkhana)",
    category: "Renovation",
    image: "/blog/basement.webp",
    author: "Nida Aziz",
    date: "Mar 10, 2024",
    readTime: "8 min read",
    content: `
      <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">01 The Modern Tehkhana</h2>
      <p class="text-lg leading-relaxed text-muted-foreground mb-8">Maximizing potential and handling seepage (Saim) in basements.</p>
    `
  }
];

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const router = useRouter();

  const post = posts.find(p => p.slug === slug);

  const defaultContent = `
    <p class="text-xl leading-relaxed text-muted-foreground mb-10 font-light italic border-l-4 border-primary/20 pl-6">
      This is a professionally curated article exploring high-end architectural trends in Pakistan.
    </p>
    <h2 class="text-3xl font-bold text-foreground mt-16 mb-6 tracking-tight">Expert Insights</h2>
    <p class="text-lg leading-relaxed text-muted-foreground mb-8">
      In our latest research into the Pakistani renovation market (Marammat), we have identified key trends that balance traditional aesthetics with modern functionality.
    </p>
    <figure class="my-12">
      <div class="relative aspect-[16/9] rounded-[2rem] overflow-hidden border border-border/50 shadow-xl">
        <img src="/blog/landscaping.webp" alt="Reference Image" class="object-cover w-full h-full" />
      </div>
      <figcaption class="text-center mt-4 text-sm text-muted-foreground italic font-light">
        High-quality detailing is the signature of a professional project.
      </figcaption>
    </figure>
  `;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the article you're looking for.</p>
          <Button asChild className="rounded-full px-8">
            <Link href="/blog">Back to Journal</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="fixed top-0 left-0 w-full h-1.5 bg-primary/10 z-50">
          <div className="h-full bg-primary w-2/3 shadow-[0_0_15px_oklch(0.5_0.18_250)]" />
        </div>

        <div className="relative w-full h-[70vh] min-h-[500px]">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 lg:p-20">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 rounded-full border border-white/20 w-12 h-12"
                >
                  <Link href="/blog">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <Badge className="bg-primary text-primary-foreground px-6 py-1.5 rounded-full border-none shadow-xl text-xs font-bold uppercase tracking-widest">
                  {post.category}
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-white/90 text-sm backdrop-blur-md bg-white/5 w-fit p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border border-white/20">
                    {post.author[0]}
                  </div>
                  <span className="font-bold text-white">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {post.readTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-20 mt-20 grid lg:grid-cols-12 gap-16">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-10 flex flex-col items-center">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary border border-border/50 w-12 h-12">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary border border-border/50 w-12 h-12">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary border border-border/50 w-12 h-12">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <article className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content || defaultContent }} />
            </article>

            <div className="mt-20 p-10 rounded-[3rem] bg-foreground text-background relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold">Never Miss a Design Insight</h3>
                <p className="text-background/70 font-light text-lg">Join our community for weekly inspiration and expert guides.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="email" placeholder="Enter your email" className="flex-1 bg-background/10 border border-background/20 rounded-2xl px-6 py-4 text-background" />
                  <Button className="bg-primary text-white rounded-2xl px-8 h-auto py-4 font-bold">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-6">
              <h4 className="font-bold text-xl flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Project Stats
              </h4>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Market</p>
                  <p className="text-sm font-semibold">Premium Residential</p>
                </div>
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Impact</p>
                  <p className="text-sm font-semibold">High Appreciation</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-border">
              <h4 className="font-bold text-xl text-foreground">Top Stories</h4>
              {[1, 2, 3].map((i) => (
                <div key={i} className="group flex gap-4 cursor-pointer">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border">
                    <OptimizedImage src={`/blog/${i === 1 ? 'kitchen' : i === 2 ? 'bathroom' : 'living-room'}.webp`} alt="Trending" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 my-10 not-prose">
                    <OptimizedImage
                      src={post.referenceImages[0]}
                      alt="Modern design reference"
                      aspectRatio="video"
                      className="rounded-3xl shadow-lg"
                    />
                    <OptimizedImage
                      src={post.referenceImages[1]}
                      alt="Local material finish"
                      aspectRatio="video"
                      className="rounded-3xl shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
