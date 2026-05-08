"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PkrIcon } from "@/components/ui/pkr-icon"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  Clock,
  Briefcase,
  Users,
  CheckCircle,
  Star
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

export default function HomeownerJobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Review state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser && jobId) {
      setLoading(true)
      
      // Fetch specific job details and bids for that job
      Promise.all([
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}`)}`).then(res => res.json()),
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/bids/job/${jobId}`)}`).then(res => res.json())
      ])
        .then(([jobData, bidsData]) => {
          if (jobData && !jobData.error) {
            setJob({
              id: jobData.id.toString(),
              title: jobData.title,
              description: jobData.description,
              category: jobData.category,
              location: jobData.location,
              budget: { min: jobData.budgetMin, max: jobData.budgetMax },
              status: jobData.status || "open",
              progress_status: jobData.progress_status || "Started",
              completion_image_url: jobData.completion_image_url || null,
              workerId: jobData.workerId,
              postedAt: new Date(jobData.created_at).toLocaleDateString(),
              isPaid: !!jobData.isPaid,
              hasReviewed: !!jobData.hasReviewed,
              homeownerId: jobData.homeownerId,
            })
          }

          if (Array.isArray(bidsData)) {
            setBids(bidsData)
          }

          setLoading(false)
        })
        .catch(err => {
          console.error("Error fetching job details:", err)
          setLoading(false)
        })
    }
  }, [jobId, router])

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this job? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}/status`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        setJob({ ...job, status: 'cancelled' });
        // You could also redirect or show a success message
      } else {
        alert("Failed to cancel job. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling job:", error);
      alert("An error occurred. Please check your connection.");
    }
  }

  const handleVerifyCompletion = async () => {
    try {
      await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}/progress`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress_status: "Completed" })
      });
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}/status`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.ok) {
        setJob({ ...job, status: 'completed', progress_status: 'Completed' });
        alert("Job successfully verified as completed!");
      }
    } catch (error) {
      console.error("Failed to verify completion:", error);
    }
  }

  const handleSubmitReview = async () => {
    if (!job.workerId) return;
    setIsSubmittingReview(true);
    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent('/api/reviews')}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          reviewer_id: job.homeownerId,
          reviewee_id: job.workerId,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      if (response.ok) {
        setJob({ ...job, hasReviewed: true });
        alert("Review submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please check your connection.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading job details...</div>
  }

  if (!job) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <p className="text-muted-foreground">The job you are looking for does not exist or you don't have access.</p>
        <Button onClick={() => router.push('/homeowner/jobs')}>Back to My Jobs</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/homeowner/jobs')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Details</h1>
          <p className="text-muted-foreground">Manage your posted project</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4" /> Posted on {job.postedAt}
                  </CardDescription>
                </div>
                <Badge variant={job.status === 'open' ? 'default' : job.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                  {job.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="font-medium">Category:</span>
                    <span className="text-muted-foreground">{job.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">Location:</span>
                    <span className="text-muted-foreground">{job.location}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <PkrIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">Budget:</span>
                    <span className="text-muted-foreground">RS {job.budget.min} - RS {job.budget.max}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">Bids Received:</span>
                    <span className="text-muted-foreground">{bids.length}</span>
                  </div>
                </div>
              </div>

              {job.status !== 'open' && job.status !== 'cancelled' && (
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Project Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">Current Milestone: <span className="text-primary">{job.progress_status}</span></span>
                      <span className="text-muted-foreground">
                        {job.progress_status === 'Completed' ? '100%' : job.progress_status === 'Pending Verification' ? '80%' : job.progress_status === '50% Completed' ? '50%' : job.progress_status === '40% Completed' ? '40%' : job.progress_status === 'Site Visit' ? '25%' : '10%'}
                      </span>
                    </div>
                    <Progress value={job.progress_status === 'Completed' ? 100 : job.progress_status === 'Pending Verification' ? 80 : job.progress_status === '50% Completed' ? 50 : job.progress_status === '40% Completed' ? 40 : job.progress_status === 'Site Visit' ? 25 : 10} className="h-2" />
                  </div>
                </div>
              )}

              {job.progress_status === 'Pending Verification' && (
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4 text-warning flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Action Required: Verify Completion
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-xl space-y-4">
                    <p className="text-sm text-muted-foreground">The worker has marked this job as finished. Please review the proof of work and verify.</p>
                    {job.completion_image_url && (
                      <div className="rounded-xl overflow-hidden border border-border">
                        <img src={job.completion_image_url} alt="Proof of work" className="w-full h-48 object-cover" />
                      </div>
                    )}
                    <Button onClick={handleVerifyCompletion} className="w-full">
                      Verify & Accept Work
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {job.status === 'completed' && !job.hasReviewed && job.workerId && (
            <Card className="border-border/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  Rate the Worker
                </CardTitle>
                <CardDescription>Your feedback helps maintain a trusted community.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${reviewRating >= star ? "text-warning fill-warning" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Share details of your own experience at this job..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <Button 
                  onClick={handleSubmitReview} 
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="w-full"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          )}

          {job.status === 'completed' && job.hasReviewed && (
            <Card className="border-border/50 bg-success/5">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Review Submitted</h3>
                  <p className="text-sm text-muted-foreground">Thank you for rating the worker!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/homeowner/bids">View All Bids</Link>
              </Button>
              {job.status === 'open' && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/homeowner/jobs/${jobId}/edit`}>Edit Job</Link>
                </Button>
              )}
              {job.status === 'completed' && !job.isPaid && (
                <Button
                  className="w-full bg-success hover:bg-success/90 text-white shadow-lg shadow-success/20"
                  asChild
                >
                  <Link href={`/homeowner/payments/pay/${jobId}`}>
                    Process Payment
                  </Link>
                </Button>
              )}
              {job.status === 'open' && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleCancel}
                >
                  Cancel Job
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Job Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Total Bids</span>
                <span className="font-semibold">{bids.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Average Bid</span>
                <span className="font-semibold">
                  RS {bids.length > 0 ? Math.round(bids.reduce((acc, b) => acc + (b.amount || 0), 0) / bids.length) : 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
