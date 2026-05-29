"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"
import Link from "next/link"
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  CheckCircle2,
  FileText,
  Camera,
  AlertTriangle,
  Star,
  Loader2,
} from "lucide-react"

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  "starting-soon": {
    label: "Starting Soon",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  "pending-review": {
    label: "Pending Review",
    className: "bg-success/10 text-success border-success/20",
  },
}

export default function WorkerActiveJobsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedJob, setSelectedJob] = useState<any>(null)

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const userId = currentUser?.id || currentUser?.UserID

  const { data: rawBids, error: bidsError } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}` : null,
    fetcher,
    { refreshInterval: 20000 }
  )

  const isLoading = !userId || (!rawBids && !bidsError);

  const jobs = useMemo(() => Array.isArray(rawBids) ? rawBids.filter((b: any) => b.status === "accepted").map((b: any) => ({
    id: b.id,
    jobId: b.job_id,
    title: b.job_title,
    client: {
      id: b.homeowner_id,
      name: b.homeowner_name || "Homeowner",
      avatar: "",
      phone: b.homeowner_phone || "+92 300 1234567", // Localized fallback
      rating: 4.8,
    },
    location: b.job_location || "Lahore, Pakistan", // Localized fallback
    startDate: new Date(b.created_at).toLocaleDateString(),
    deadline: "2 Weeks",
    amount: b.amount,
    status: b.job_status === 'completed' ? 'pending-review' : 'in-progress',
    progress: b.job_status === 'completed' ? 100 : 35,
    tasks: [
      { name: "Initial project setup", completed: true },
      { name: "Primary phase work", completed: b.job_status === 'completed' },
      { name: "Final verification", completed: b.job_status === 'completed' },
    ],
    notes: b.proposal_text || "No additional notes.",
  })) : [], [rawBids])

  // Auto-select first job if none selected
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    } else if (jobs.length > 0 && selectedJob) {
      const updated = jobs.find(j => j.id === selectedJob.id)
      if (updated) setSelectedJob(updated)
    }
  }, [jobs, selectedJob])

  const handleTaskToggle = (taskIndex: number) => {
    if (!selectedJob) return
    const updatedTasks = [...selectedJob.tasks]
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed
    
    // Calculate new progress
    const newProgress = Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100)
    
    const updatedJob = {
      ...selectedJob,
      tasks: updatedTasks,
      progress: newProgress
    }
    setSelectedJob(updatedJob)
  }

  const handleMarkComplete = async () => {
    if (!selectedJob) return
    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${selectedJob.jobId}/status`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
      });
      if (response.ok) {
        mutate(`/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}`)
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  }

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      Loading active projects...
    </div>
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Active Jobs</h3>
          <p className="text-muted-foreground mb-6">You don't have any ongoing projects. Go to "Find Jobs" to bid on new work!</p>
          <Button asChild>
            <Link href="/worker/jobs">Browse Jobs</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalEarnings = jobs.reduce((acc, job) => acc + job.amount, 0)
  const completedTasks = jobs.reduce(
    (acc, job) => acc + job.tasks.filter((t: any) => t.completed).length,
    0
  )
  const totalTasks = jobs.reduce((acc, job) => acc + job.tasks.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Active Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage your ongoing projects</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{jobs.length}</div>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary flex items-center gap-1">
              <PkrIcon className="w-5 h-5" />
              {totalEarnings.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{completedTasks}</div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">{totalTasks - completedTasks}</div>
            <p className="text-sm text-muted-foreground">Tasks Remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-foreground">Your Jobs</h2>
          {jobs.map((job) => {
            const status = statusConfig[job.status as keyof typeof statusConfig] || statusConfig["in-progress"]
            return (
              <Card
                key={job.id}
                className={`border-border/50 cursor-pointer transition-all hover:shadow-md ${
                  selectedJob?.id === job.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.client.name}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Started {job.startDate}
                    </span>
                    <span className="font-semibold text-primary flex items-center gap-1">
                      <PkrIcon className="w-3 h-3" />
                      {job.amount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Job Details */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedJob.title}</CardTitle>
                    <p className="text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={(statusConfig[selectedJob.status as keyof typeof statusConfig] || statusConfig["in-progress"]).className}
                  >
                    {(statusConfig[selectedJob.status as keyof typeof statusConfig] || statusConfig["in-progress"]).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="client">Client</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 mt-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {selectedJob.startDate}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          {selectedJob.deadline}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Job Value</p>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <PkrIcon className="h-4 w-4 text-primary" />
                          RS {selectedJob.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Progress</p>
                        <p className="font-semibold text-foreground">{selectedJob.progress}% Complete</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Proposal Notes
                      </h4>
                      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                        <p className="text-sm text-foreground">{selectedJob.notes}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={handleMarkComplete} disabled={selectedJob.status === 'pending-review'}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {selectedJob.status === 'pending-review' ? 'Awaiting Client Review' : 'Mark Project Done'}
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/worker/messages">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Client
                        </Link>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-6">
                    <div className="space-y-3">
                      {selectedJob.tasks.map((task: any, index: number) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            task.completed
                              ? "bg-success/5 border-success/20"
                              : "bg-muted/30 border-border"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              task.completed ? "bg-success" : "bg-muted border-2 border-border"
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="h-4 w-4 text-success-foreground" />}
                          </div>
                          <span
                            className={`flex-1 ${
                              task.completed ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                          >
                            {task.name}
                          </span>
                          {!task.completed && (
                            <Button size="sm" variant="outline" onClick={() => handleTaskToggle(index)}>
                              Mark Done
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Progress
                        value={(selectedJob.tasks.filter((t: any) => t.completed).length / selectedJob.tasks.length) * 100}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {selectedJob.tasks.filter((t: any) => t.completed).length} of {selectedJob.tasks.length} tasks completed
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="client" className="mt-6">
                    <div className="flex items-start gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedJob.client.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {selectedJob.client.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{selectedJob.client.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="font-medium text-foreground">{selectedJob.client.rating}</span>
                          <span className="text-muted-foreground">client rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{selectedJob.client.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Job Address</p>
                          <p className="font-medium text-foreground">{selectedJob.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button className="flex-1" asChild>
                        <Link href={`/worker/messages?contactId=${selectedJob.client.id || 'owner'}&name=${encodeURIComponent(selectedJob.client.name)}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">Select a job to see details</div>
          )}
        </div>
      </div>
    </div>
  )
}
