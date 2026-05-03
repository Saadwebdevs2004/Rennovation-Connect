"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCard, Job } from "@/components/dashboard/job-card"
import { Plus, Search, Filter, Loader2 } from "lucide-react"

export default function HomeownerJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Get the logged-in homeowner's ID
    const storedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (storedUser) {
      const userObj = JSON.parse(storedUser)
      const userId = userObj.id || userObj.UserID || userObj.userId

      // 2. Fetch their real jobs from the Node.js backend
      fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/homeowner/${userId}`)}`)
        .then(res => res.json())
        .then(data => {
            // Map the database columns to match the JobCard design
            const formattedJobs = data.map((job: any) => ({
                id: job.id.toString(),
                title: job.title,
                description: job.description,
                category: job.category,
                location: job.location,
                budget: { min: job.budgetMin, max: job.budgetMax },
                bidsCount: job.bidsCount || 0,
                status: job.status || "open",
                isPaid: !!job.isPaid,
                postedAt: new Date(job.created_at).toLocaleDateString(), 
            }))
            setJobs(formattedJobs)
            setIsLoading(false)
        })
        .catch(err => {
            console.error("Failed to fetch jobs:", err)
            setIsLoading(false)
        })
    } else {
        setIsLoading(false)
    }
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "open") return matchesSearch && job.status === "open"
    if (activeTab === "in_progress") return matchesSearch && job.status === "in_progress"
    if (activeTab === "completed") return matchesSearch && job.status === "completed"
    return matchesSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage all your posted jobs</p>
        </div>
        <Button asChild>
          <Link href="/homeowner/jobs/new">
            <Plus className="mr-2 w-4 h-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({jobs.filter(j => j.status === "open").length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({jobs.filter(j => j.status === "in_progress").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({jobs.filter(j => j.status === "completed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="homeowner" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground mb-4">No jobs found. Start your first project!</p>
              <Button asChild>
                <Link href="/homeowner/jobs/new">Post Your First Job</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}