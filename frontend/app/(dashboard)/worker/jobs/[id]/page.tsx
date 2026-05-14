"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowLeft, Lock, Info, CheckCircle2, ShieldCheck } from "lucide-react"
import { PkrIcon } from "@/components/ui/pkr-icon"
import { Skeleton } from "@/components/ui/skeleton"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id
  
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Bid form state
  const [bidAmount, setBidAmount] = useState("")
  const [proposalText, setProposalText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (jobId) {
      fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}`)}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setJob(data)
          }
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch job details:", err)
          setLoading(false)
        })
    }
  }, [jobId])

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (!savedUser) {
      alert("Please login first.")
      return
    }
    
    const user = JSON.parse(savedUser)
    const workerId = user.id || user.UserID
    
    if (!workerId || !bidAmount) return
    
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/proxy?path=%2Fapi%2Fbids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          worker_id: workerId,
          amount: parseFloat(bidAmount),
          proposal_text: proposalText
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        alert("Bid placed successfully!")
        router.push('/worker/bids')
      } else {
        alert("Failed to place bid: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error submitting bid:", error)
      alert("An error occurred while submitting your bid.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-96 rounded-[2.5rem]" />
          </div>
          <Skeleton className="h-80 rounded-[2.5rem]" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-20 text-center">
        <Info className="w-16 h-16 text-muted/20 mx-auto mb-4" />
        <h2 className="text-2xl font-black">Job Not Found</h2>
        <Button variant="link" asChild className="mt-2"><Link href="/worker/jobs">Back to job board</Link></Button>
      </div>
    )
  }

  const isJobOpen = (job.status || 'Open').toLowerCase() === 'open';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="rounded-xl hover:bg-primary/5 font-bold group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Jobs
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="p-8 lg:p-12 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "rounded-lg px-4 py-1 font-black text-[10px] uppercase tracking-widest border-none",
                      isJobOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {job.status || 'Open'}
                    </Badge>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Job #{job.id}</span>
                  </div>
                  <CardTitle className="text-3xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">{job.title}</CardTitle>
                  <p className="text-lg text-primary font-bold">{job.category}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 lg:p-12 pt-0 space-y-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6 rounded-3xl bg-muted/20 border border-border/30">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</p>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {job.location}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Budget Range</p>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <PkrIcon className="w-4 h-4 text-primary" />
                    RS {job.budgetMin.toLocaleString()} - {job.budgetMax.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date Posted</p>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  Project Description
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium whitespace-pre-wrap">{job.description}</p>
              </div>

              <div className="pt-6 border-t border-border/30">
                 <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                   <ShieldCheck className="w-5 h-5 text-success" />
                   Verified Project Payment with Escrow Protection
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          {isJobOpen ? (
            <Card className="sticky top-24 rounded-[2.5rem] border-primary/20 shadow-2xl shadow-primary/5 overflow-hidden">
              <div className="bg-primary p-6 lg:p-8 text-white">
                <CardTitle className="text-2xl font-black">Submit a Proposal</CardTitle>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">Start this project</p>
              </div>
              <CardContent className="p-6 lg:p-8">
                <form onSubmit={handlePlaceBid} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Your Quote (RS)</label>
                    <div className="relative">
                       <PkrIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input 
                        type="number" 
                        min="1" 
                        required 
                        placeholder="e.g. 5000" 
                        className="pl-12 h-14 rounded-2xl border-border/50 focus:ring-primary shadow-sm text-lg font-bold"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Proposal Details</label>
                    <Textarea 
                      required 
                      placeholder="Detail your expertise and why you're a fit..."
                      className="min-h-[180px] rounded-2xl border-border/50 focus:ring-primary shadow-sm font-medium p-4 leading-relaxed"
                      value={proposalText}
                      onChange={(e) => setProposalText(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" disabled={submitting}>
                    {submitting ? "Submitting..." : "Place Your Bid"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-[2.5rem] border-warning/20 bg-warning/5 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-warning" />
                  </div>
                  <CardTitle className="text-2xl font-black text-warning">Project Closed</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    This job is currently <span className="font-bold text-foreground">{job.status}</span> and is no longer accepting new proposals.
                  </p>
                  <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs" variant="outline" asChild>
                    <Link href="/worker/jobs">Browse Job Board</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-primary/10 p-8 space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest">Need Help?</h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">If you think this is a mistake or need clarification, contact our support team.</p>
                <Button variant="link" className="p-0 h-auto font-black text-primary text-xs uppercase tracking-widest">Contact Support</Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
