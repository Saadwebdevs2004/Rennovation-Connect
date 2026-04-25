import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const posts = [
  {
    title: "10 Tips for a Successful Kitchen Remodel",
    excerpt: "Planning your dream kitchen? Here are the top things you need to consider before you start.",
    author: "Jane Smith",
    date: "Mar 15, 2024",
    category: "Remodeling"
  },
  {
    title: "How to Choose the Right Contractor",
    excerpt: "Don't hire blindly. Learn the key questions you should ask every professional before signing a contract.",
    author: "Mike Johnson",
    date: "Mar 10, 2024",
    category: "Guides"
  },
  {
    title: "Eco-Friendly Renovation Trends for 2024",
    excerpt: "Sustainable building is more than just a trend. Discover how to make your home renovation greener.",
    author: "Sarah Wilson",
    date: "Mar 5, 2024",
    category: "Sustainability"
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert advice, renovation tips, and success stories from the Renovation Connect community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.title} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                  Featured Image
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase mb-3">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto font-bold">
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
