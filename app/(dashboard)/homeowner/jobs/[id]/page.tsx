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
  Star,
  ShieldCheck,
  Zap,
  Info,
  TrendingUp,
  History,
  Camera
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { cn } from "@/lib/utils"

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
  }, [jobId])

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
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  }

  const isRealImage = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    // Exclude common placeholder/test domains
    if (lowerUrl.includes('unsplash.com')) return false;
    if (lowerUrl.includes('placeholder')) return false;
    if (lowerUrl.includes('example.com')) return false;
    return url.startsWith('http') || url.startsWith('/');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-96 rounded-[3rem]" />
          </div>
          <Skeleton className="h-[500px] rounded-[3rem]" />
        </div>
      </div>
    )
  }

  const progressMap: any = {
    'Completed': 100,
    'Pending Verification': 80,
    '50% Completed': 50,
    '40% Completed': 40,
    'Site Visit': 25,
    'Started': 10
  }

  const currentProgress = progressMap[job.progress_status] || 10

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/homeowner/jobs')} 
        className="rounded-xl hover:bg-primary/5 font-bold group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Job Card */}
          <Card className="rounded-[3rem] border-border/50 shadow-sm overflow-hidden group">
            <CardHeader className="p-10 lg:p-14 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "rounded-lg px-4 py-1 font-black text-[10px] uppercase tracking-widest border-none shadow-sm",
                      job.status === 'open' ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                    )}>
                      {job.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Job ID: {job.id}</span>
                  </div>
                  <CardTitle className="text-4xl lg:text-6xl font-black text-foreground tracking-tighter leading-[1.1]">{job.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 lg:p-14 pt-0 space-y-12">
               <div className="grid sm:grid-cols-2 gap-8 p-8 rounded-[2.5rem] bg-muted/20 border border-border/40">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</span>
                        <span className="font-bold">{job.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</span>
                        <span className="font-bold">{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                        <PkrIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Budget Allocation</span>
                        <span className="font-bold">RS {job.budget.min.toLocaleString()} - {job.budget.max.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date Published</span>
                        <span className="font-bold">{job.postedAt}</span>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                 <h3 className="text-2xl font-black flex items-center gap-4">
                    <div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_oklch(0.5_0.18_250)]" />
                    Project Scope
                 </h3>
                 <p className="text-muted-foreground text-xl leading-relaxed font-medium whitespace-pre-wrap">{job.description}</p>
               </div>

               {job.status !== 'open' && job.status !== 'cancelled' && (
                <div className="space-y-8 pt-10 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black">Project Velocity</h3>
                    <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                       {job.progress_status}
                    </Badge>
                  </div>
                  <div className="space-y-6">
                    <Progress value={currentProgress} className="h-4 rounded-full bg-muted border p-1" />
                    <div className="flex justify-between px-2">
                       {['Site Visit', 'Ongoing', 'Review', 'Finish'].map((stage, i) => (
                         <div key={stage} className="flex flex-col items-center gap-2">
                           <div className={cn(
                             "w-3 h-3 rounded-full border-2",
                             currentProgress >= (i+1)*25 ? "bg-primary border-primary shadow-[0_0_8px_oklch(0.5_0.18_250)]" : "bg-muted border-muted-foreground/20"
                           )} />
                           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stage}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
               )}

               {job.progress_status === 'Pending Verification' && (
                <Card className="rounded-[2.5rem] border-primary/20 bg-primary/[0.02] overflow-hidden shadow-2xl shadow-primary/5">
                  <div className="bg-primary p-8 text-white">
                    <div className="flex items-center gap-4">
                       <Zap className="w-8 h-8 fill-white animate-pulse" />
                       <div>
                         <h3 className="text-2xl font-black leading-tight">Verification Required</h3>
                         <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Review proof of work</p>
                       </div>
                    </div>
                  </div>
                  <CardContent className="p-10 space-y-8">
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                      The worker has submitted the project for your final review. Please inspect the results carefully before accepting.
                    </p>
                    {isRealImage(job.completion_image_url) && (
                      <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                        <OptimizedImage src={job.completion_image_url} alt="Proof of work" aspectRatio="video" />
                      </div>
                    )}
                    {!isRealImage(job.completion_image_url) && (
                      <div className="p-10 text-center border-2 border-dashed border-primary/20 rounded-[2rem] bg-primary/5">
                        <Camera className="w-10 h-10 text-primary/40 mx-auto mb-4" />
                        <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">Awaiting Visual Proof</p>
                      </div>
                    )}
                    <Button onClick={handleVerifyCompletion} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02]">
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Verify & Release Payment
                    </Button>
                  </CardContent>
                </Card>
               )}
            </CardContent>
          </Card>

          {/* Rating Engine */}
          {job.status === 'completed' && !job.hasReviewed && job.workerId && (
            <Card className="rounded-[3rem] border-none bg-gradient-to-br from-foreground to-foreground/90 text-background overflow-hidden relative shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Star className="w-48 h-48 rotate-12" />
               </div>
               <CardHeader className="p-12 lg:p-16 pb-6">
                  <CardTitle className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
                    Project Success! <br/><span className="text-primary italic">Rate Your Pro</span>
                  </CardTitle>
                  <CardDescription className="text-background/50 text-lg font-medium">Your feedback is the lifeblood of RenoConnect.</CardDescription>
               </CardHeader>
               <CardContent className="p-12 lg:p-16 pt-0 space-y-10">
                  <div className="flex flex-col items-center gap-8 py-10 bg-white/5 rounded-[2.5rem] border border-white/10">
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star className={cn(
                            "w-12 h-12 transition-all duration-300",
                            reviewRating >= star ? "text-primary fill-primary drop-shadow-[0_0_15px_oklch(0.5_0.18_250)]" : "text-white/20"
                          )} />
                        </button>
                      ))}
                    </div>
                    <div className="text-center space-y-1">
                       <p className="text-2xl font-black text-white">{reviewRating} / 5 Stars</p>
                       <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40">Performance Rating</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-2">Detailed Feedback</label>
                    <Textarea
                      placeholder="Explain the quality, communication, and professionalism..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="min-h-[150px] bg-white/5 border-white/10 rounded-3xl text-white text-lg font-medium p-6 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <Button 
                    onClick={handleSubmitReview} 
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="w-full h-20 rounded-[2rem] bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40"
                  >
                    {isSubmittingReview ? "Broadcasting Feedback..." : "Submit Verified Review"}
                  </Button>
               </CardContent>
            </Card>
          )}

          {job.status === 'completed' && job.hasReviewed && (
            <Card className="rounded-[3rem] border-success/20 bg-success/[0.02] p-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-success" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black">Reputation Secured</h3>
                  <p className="text-lg font-medium text-muted-foreground">Your verified review has been added to the worker's official profile.</p>
                </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
           <Card className="rounded-[3rem] border-border/50 p-10 space-y-8 sticky top-24">
              <h3 className="text-xl font-black uppercase tracking-widest">Control Panel</h3>
              <div className="space-y-4">
                <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20" asChild>
                  <Link href="/homeowner/bids">
                    <Users className="w-4 h-4 mr-2" />
                    Review All Bids ({bids.length})
                  </Link>
                </Button>
                {job.status === 'open' && (
                  <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2" asChild>
                    <Link href={`/homeowner/jobs/${jobId}/edit`}>Edit Specifications</Link>
                  </Button>
                )}
                {job.status === 'completed' && !job.isPaid && (
                  <Button className="w-full h-16 rounded-2xl bg-success hover:bg-success/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-success/30" asChild>
                    <Link href={`/homeowner/payments/pay/${jobId}`}>
                      Process Final Payment
                    </Link>
                  </Button>
                )}
              </div>

              <div className="pt-8 border-t border-border/30 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg. Bid</span>
                  <span className="font-black text-xl">
                    {bids.length > 0 ? (
                      `RS ${Math.round(bids.reduce((acc, b) => acc + (Number(b.amount) || 0), 0) / bids.length).toLocaleString()}`
                    ) : (
                      "No Bids"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pro Visibility</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-black text-primary">High</span>
                  </div>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
