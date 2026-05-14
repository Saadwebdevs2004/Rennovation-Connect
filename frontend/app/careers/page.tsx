import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const jobs = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / New York",
    type: "Full-time"
  },
  {
    title: "Product Designer",
    department: "Product",
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Customer Success Lead",
    department: "Operations",
    location: "Remote / London",
    type: "Full-time"
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time"
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">Hiring in all departments</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Build the Future of Home Improvement</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Help us connect millions of homeowners with the skilled professionals they need. We're a remote-first team of makers, designers, and problem solvers.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Remote-First</h3>
              <p className="text-muted-foreground text-sm">Work from anywhere in the world. We believe in results, not office hours.</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Growth Budget</h3>
              <p className="text-muted-foreground text-sm">Annual budget for books, courses, and conferences to help you grow.</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Ownership</h3>
              <p className="text-muted-foreground text-sm">Equity packages for all full-time employees. We're all in this together.</p>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-10">Current Openings</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.title} className="group bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-fit group-hover:translate-x-1 transition-transform">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
