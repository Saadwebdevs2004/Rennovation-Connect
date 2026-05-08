import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Calendar, ArrowRight, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export const posts = [
  {
    slug: "spatial-harmony-open-concept",
    title: "The Art of Spatial Harmony: A Guide to Open-Concept Living (Baithak & Lounge)",
    excerpt: "Discover how to balance fluidity and function in open-plan spaces, creating a seamless transition between the Lounge and the Drawing Room (Baithak) without sacrificing intimacy.",
    author: "Zainab Sheikh",
    date: "May 10, 2024",
    readTime: "8 min read",
    category: "Interior Design",
    image: "/blog/living-room.png",
    featured: true
  },
  {
    slug: "luxury-kitchen-trends",
    title: "Culinary Sanctuaries: Trends in Luxury Kitchens (Bawarchi Khana)",
    excerpt: "From waterfall marble islands to the essential Dirty Kitchen (Bawarchi Khana), explore the elements that define the modern high-end kitchen as both a workshop and a social hub.",
    author: "Ahmed Khan",
    date: "May 8, 2024",
    readTime: "6 min read",
    category: "Renovation",
    image: "/blog/kitchen.png"
  },
  {
    slug: "spa-bathroom-experience",
    title: "The Spa Revolution: Elevating Your Bathroom (Ghusal Khana)",
    excerpt: "Transform your daily routine into a ritual with the latest in hydrotherapy, smart mirrors, and natural stone finishes for a truly private sanctuary (Sukoon).",
    author: "Faiza Ahmed",
    date: "May 5, 2024",
    readTime: "5 min read",
    category: "Luxury Living",
    image: "/blog/bathroom.png"
  },
  {
    slug: "smart-home-integration",
    title: "Smart Integration: The Future of Seamless Home Automation",
    excerpt: "Beyond voice commands: how artificial intelligence is creating homes that anticipate your needs, from climate control to biometric security systems.",
    author: "Usman Ali",
    date: "May 2, 2024",
    readTime: "7 min read",
    category: "Technology",
    image: "/blog/smart-home.png"
  },
  {
    slug: "sustainable-luxury-materials",
    title: "Sustainable Luxury: Eco-Conscious Materials (Lakri & Pathar)",
    excerpt: "Proof that sustainability and style are not mutually exclusive. A deep dive into reclaimed wood (Lakri), VOC-free finishes, and energy-neutral architecture.",
    author: "Hina Malik",
    date: "Apr 28, 2024",
    readTime: "9 min read",
    category: "Sustainability",
    image: "/blog/sustainability.png"
  },
  {
    slug: "indoor-outdoor-landscaping",
    title: "Curated Landscapes: Designing Your Outdoor Space (Sehan)",
    excerpt: "Design strategies for creating outdoor living rooms and gardens (Sehan) that offer the same comfort and aesthetic rigor as your interior spaces.",
    author: "Bilal Shah",
    date: "Apr 25, 2024",
    readTime: "6 min read",
    category: "Architecture",
    image: "/blog/landscaping.png"
  },
  {
    slug: "ultimate-home-office",
    title: "The Productive Retreat: Designing the Ultimate Home Office",
    excerpt: "Ergonomics meets aesthetics in our guide to creating a professional workspace that inspires focus while maintaining the comfort of home.",
    author: "Sana Ijaz",
    date: "Apr 20, 2024",
    readTime: "5 min read",
    category: "Home Office",
    image: "/blog/home-office.png"
  },
  {
    slug: "lighting-impact-mood",
    title: "Illuminating Architecture: The Impact of Lighting (Roshni)",
    excerpt: "Mastering the three layers of lighting (Roshni)—ambient, task, and accent—to dramatically change the atmosphere of any room in your home.",
    author: "Hamza Butt",
    date: "Apr 15, 2024",
    readTime: "7 min read",
    category: "Design Tips",
    image: "/blog/lighting.png"
  },
  {
    slug: "herringbone-flooring-appeal",
    title: "Foundations of Style: The Timeless Appeal of Herringbone Flooring (Farsh)",
    excerpt: "Why this classic pattern remains the gold standard for high-end residential flooring (Farsh), and how to choose the right wood species for your space.",
    author: "Maryam Jameel",
    date: "Apr 10, 2024",
    readTime: "4 min read",
    category: "Materials",
    image: "/blog/flooring.png"
  },
  {
    slug: "psychology-of-color",
    title: "The Psychology of Color (Rang): Crafting a Sophisticated Palette",
    excerpt: "Move beyond white walls. Understand how different colors (Rang) affect emotion and how to build a cohesive color story through every room.",
    author: "Zeeshan Haider",
    date: "Apr 5, 2024",
    readTime: "8 min read",
    category: "Interior Design",
    image: "/blog/color-palette.png"
  },
  {
    slug: "small-space-solutions",
    title: "Compact Elegance: Solutions for Small Urban Spaces (Choti Jagah)",
    excerpt: "Maximizing every square inch with bespoke multifunctional furniture and strategic glass elements for the modern urban dweller.",
    author: "Amna Rehman",
    date: "Mar 30, 2024",
    readTime: "6 min read",
    category: "Urban Living",
    image: "/blog/small-spaces.png"
  },
  {
    slug: "modern-dining-room-hosting",
    title: "The Formal Revival: Hosting in the Modern Dining Room",
    excerpt: "The dining room is making a comeback. Learn how to design a space that facilitates conversation and celebrates the art of the dinner party.",
    author: "Farhan Saeed",
    date: "Mar 25, 2024",
    readTime: "5 min read",
    category: "Lifestyle",
    image: "/blog/dining-room.png"
  },
  {
    slug: "modernizing-exterior-cladding",
    title: "Curb Appeal Reimagined: Modernizing Your Home's Exterior",
    excerpt: "First impressions are permanent. Discover the latest trends in exterior design that instantly elevate your property value and style.",
    author: "Rabia Bashir",
    date: "Mar 20, 2024",
    readTime: "7 min read",
    category: "Renovation",
    image: "/blog/exterior.png"
  },
  {
    slug: "master-bedroom-suite-luxury",
    title: "Private Sanctuaries: Creating a Luxury Master Bedroom (Kamra)",
    excerpt: "Infusing hotel-inspired luxury into your sleeping quarters (Kamra) through layered textiles, bespoke headboards, and acoustic optimization.",
    author: "Omar Khalid",
    date: "Mar 15, 2024",
    readTime: "6 min read",
    category: "Luxury Living",
    image: "/blog/bedroom.png"
  },
  {
    slug: "basement-potential-luxury",
    title: "Subterranean Luxury: Maximizing Your Basement (Tehkhana)",
    excerpt: "From private cinemas to climate-controlled wine cellars, see how the basement (Tehkhana) is becoming the most exciting floor in the luxury home.",
    author: "Nida Aziz",
    date: "Mar 10, 2024",
    readTime: "8 min read",
    category: "Renovation",
    image: "/blog/basement.png"
  }
]

export default function BlogPage() {
  const featuredPost = posts.find(p => p.featured)
  const regularPosts = posts.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1 border-primary/30 text-primary bg-primary/5 rounded-full">
              Insights & Expertise
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
              Our <span className="text-primary">Journal</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Curated perspectives on modern architecture, luxury renovation (Marammat), and the future of home design in Pakistan.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-20">
              <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card shadow-2xl transition-all hover:shadow-primary/5">
                <div className="grid lg:grid-cols-2 items-center">
                  <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden">
                    <Image 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-8 lg:p-16 space-y-6">
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1 rounded-full">
                        {featuredPost.category}
                      </Badge>
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {featuredPost.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{featuredPost.author}</p>
                          <p className="text-xs text-muted-foreground">{featuredPost.date}</p>
                        </div>
                      </div>
                      <Button asChild variant="ghost" className="group/btn text-primary hover:bg-primary/5 rounded-full px-6">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Read Story
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <div 
                key={post.title} 
                className="group flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-black hover:bg-white px-3 py-1 rounded-full border-none shadow-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1 font-light">
                    {post.excerpt}
                  </p>
                  <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{post.author}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-full p-0 w-8 h-8 flex items-center justify-center">
                      <Link href={`/blog/${post.slug}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter / CTA */}
          <div className="mt-32 relative rounded-[3rem] overflow-hidden bg-primary px-8 py-16 lg:p-20 text-center text-primary-foreground shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Stay Inspired</h2>
              <p className="text-lg text-primary-foreground/80 font-light">
                Subscribe to our newsletter for exclusive design insights, renovation (Marammat) trends, and community highlights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
                />
                <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-auto py-4 font-bold">
                  Subscribe
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
