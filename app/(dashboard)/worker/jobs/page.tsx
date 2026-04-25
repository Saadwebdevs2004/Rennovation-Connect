"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobCard, Job } from "@/components/dashboard/job-card"
import { Search, Filter, MapPin, SlidersHorizontal } from "lucide-react"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "carpentry", label: "Carpentry" },
  { value: "painting", label: "Painting" },
  { value: "hvac", label: "HVAC" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen", label: "Kitchen" },
]

const budgetRanges = [
  { value: "all", label: "Any Budget" },
  { value: "0-500", label: "Under RS 500" },
  { value: "500-2000", label: "RS 500 - 2,000" },
  { value: "2000-5000", label: "RS 2,000 - 5,000" },
  { value: "5000+", label: "RS 5,000+" },
]

export default function WorkerJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [budget, setBudget] = useState("all")
  const [location, setLocation] = useState("")
  const [availableJobs, setAvailableJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    let workerIdParam = ''
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed.UserID) {
          workerIdParam = `?workerId=${parsed.UserID}`
        }
      } catch(e) {}
    }

    fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs${workerIdParam}`)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mappedJobs: Job[] = data.map((row: any) => ({
            id: String(row.id),
            title: row.title,
            description: row.description,
            category: row.category || "General",
            location: row.location || "Remote",
            budget: { min: row.budgetMin || 0, max: row.budgetMax || 0 },
            bidsCount: 0, // Placeholder until bids are fully integrated here
            status: row.status || "open",
            postedAt: new Date(row.created_at).toLocaleDateString(),
            hasBidded: row.hasBidded || false
          }))
          setAvailableJobs(mappedJobs)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch jobs:", err)
        setLoading(false)
      })
  }, [])

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === "all" || job.category.toLowerCase() === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Find Jobs</h1>
        <p className="text-muted-foreground mt-1">Browse available projects in your area</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative w-full lg:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="shrink-0">
            <SlidersHorizontal className="mr-2 w-4 h-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary">Within 25 miles</Badge>
          <Badge variant="secondary">Matches your skills</Badge>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} variant="worker" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground mb-4">No jobs found matching your criteria</p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setCategory("all"); setBudget("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
