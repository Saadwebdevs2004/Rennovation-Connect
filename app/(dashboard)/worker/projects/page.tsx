"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, MessageSquare, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function WorkerProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = () => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      if (userId) {
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              const activeProjects = data.filter(b => b.status === "accepted").map(b => ({
                id: b.id,
                jobId: b.job_id,
                title: b.job_title,
                client: "Homeowner", 
                location: "Local",
                amount: b.amount,
                startDate: new Date(b.created_at).toLocaleDateString(),
                status: b.job_status === 'completed' ? 'Completed' : 'In Progress',
                progress: b.job_status === 'completed' ? 100 : 35,
                nextMilestone: b.job_status === 'completed' ? 'Finished' : 'Rough-in inspection',
              }))
              setProjects(activeProjects)
            }
            setLoading(false)
          })
          .catch(err => {
            console.error("Failed to fetch projects:", err)
            setLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleMarkComplete = async (jobId: string) => {
    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}/status`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
      });
      if (response.ok) {
        // Refresh the projects list to show updated status
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Projects</h1>
        <p className="text-muted-foreground mt-1">Manage your active and completed projects</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="mt-1">Client: {project.client}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Started: {project.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <PkrIcon className="w-4 h-4" />
                    RS {project.amount}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Project Progress</span>
                    <span className="text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Next milestone: <span className="font-medium text-foreground">{project.nextMilestone}</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1" asChild>
                    <Link href="/worker/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Client
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => handleMarkComplete(project.jobId)}
                    disabled={project.status === 'Completed'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {project.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Active Projects</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any accepted bids or active projects at the moment. Browse available jobs to submit proposals.
            </p>
            <Button asChild>
              <Link href="/worker/jobs">Find New Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
