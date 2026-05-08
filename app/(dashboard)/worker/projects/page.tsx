"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, MessageSquare, CheckCircle, Clock, UploadCloud } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import confetti from 'canvas-confetti'
import { PartyPopper, Trophy, Sparkles } from "lucide-react"

export default function WorkerProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebratedJob, setCelebratedJob] = useState<string>("")
  
  // Proof of work modal state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [proofImage, setProofImage] = useState<string | null>(null)
  const [isSubmittingProof, setIsSubmittingProof] = useState(false)

  const fetchProjects = async () => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      if (userId) {
        try {
          const [bidsRes, paymentsRes] = await Promise.all([
            fetch(`/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}`),
            fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/worker/${userId}`)}`)
          ]);

          const bidsData = await bidsRes.json();
          const paymentsData = await paymentsRes.json();

          if (Array.isArray(bidsData)) {
            const activeProjects = bidsData.filter(b => b.status === "accepted").map(b => {
              let progressValue = 10;
              let nextMilestoneStr = 'Site Visit';
              const pStatus = b.job_progress_status || 'Started';
              
              // Find payment status for this job (Robust check)
              const payment = Array.isArray(paymentsData) ? paymentsData.find((p: any) => String(p.job_id) === String(b.job_id)) : null;
              
              // If there's a payment and it's not completed, it's pending for the worker
              const isPaymentPending = payment && payment.status !== 'completed';
              const paymentStatus = payment?.status || 'none';

              if (pStatus === 'Site Visit') { progressValue = 25; nextMilestoneStr = '40% Completed'; }
              if (pStatus === '40% Completed') { progressValue = 40; nextMilestoneStr = '50% Completed'; }
              if (pStatus === '50% Completed') { progressValue = 50; nextMilestoneStr = 'Pending Verification'; }
              if (pStatus === 'Pending Verification') { progressValue = 80; nextMilestoneStr = 'Waiting for Homeowner'; }
              if (b.job_status === 'completed' || pStatus === 'Completed') { progressValue = 100; nextMilestoneStr = 'Finished'; }

              return {
                id: b.id,
                jobId: b.job_id,
                title: b.job_title,
                client: "Homeowner", 
                location: "Local",
                amount: b.amount,
                startDate: new Date(b.created_at).toLocaleDateString(),
                status: (b.job_status === 'completed' || pStatus === 'Completed') ? 'Completed' : 'In Progress',
                progress_status: pStatus,
                progress: progressValue,
                nextMilestone: nextMilestoneStr,
                paymentStatus: paymentStatus,
                isPaymentPending: isPaymentPending,
                paymentId: payment?.id,
                isPaid: !!b.job_is_paid || paymentStatus === 'completed'
              }
            })
            setProjects(activeProjects)
          }
          setLoading(false)
        } catch (err) {
          console.error("Failed to fetch projects or payments:", err)
          setLoading(false)
        }
      }
    }
  }

  const handleApprovePayment = async (paymentId: number | undefined) => {
    if (!paymentId) {
      alert("Payment record not found. Please try again in a moment.");
      return;
    }
    
    try {
      const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/${paymentId}/approve`)}`, {
        method: 'PUT'
      });
      if (res.ok) {
        // Optimistic Update: Change the project status locally so it "locks in" instantly
        setProjects(prev => prev.map(p => 
          p.paymentId === paymentId ? { ...p, isPaymentPending: false, isPaid: true } : p
        ));

        // Trigger Confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        });

        // Show Celebration Modal
        const job = projects.find(p => p.paymentId === paymentId);
        setCelebratedJob(job?.title || "Project");
        setShowCelebration(true);
        
        // Background refresh to sync with DB
        fetchProjects();
      } else {
        alert("Verification failed. Please check your connection.");
      }
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("A system error occurred. Please try again.");
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
      await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}/progress`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress_status: "Completed" })
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  }

  const handleUpdateProgress = async (jobId: string, progress_status: string) => {
    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}/progress`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress_status })
      });
      if (response.ok) {
        if (progress_status === 'Completed') {
          await handleMarkComplete(jobId);
        } else {
          fetchProjects();
        }
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  }

  const handleSubmitProof = async () => {
    if (!selectedJobId) return;
    setIsSubmittingProof(true);
    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${selectedJobId}/progress`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          progress_status: "Pending Verification",
          completion_image_url: proofImage || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop" // Simulated Image
        })
      });
      if (response.ok) {
        setSelectedJobId(null);
        setProofImage(null);
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to submit proof:", error);
    } finally {
      setIsSubmittingProof(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate file upload by creating a local object URL
      const url = URL.createObjectURL(e.target.files[0]);
      setProofImage(url);
    }
  };

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
                  {project.status !== 'Completed' ? (
                    project.nextMilestone === 'Pending Verification' ? (
                      <Button 
                        variant="default" 
                        className="flex-1" 
                        onClick={() => setSelectedJobId(project.jobId)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit for Verification
                      </Button>
                    ) : project.nextMilestone === 'Waiting for Homeowner' ? (
                      <Button variant="outline" className="flex-1" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Waiting for Approval
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => handleUpdateProgress(project.jobId, project.nextMilestone)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark {project.nextMilestone}
                      </Button>
                    )
                  ) : (
                    (project.isPaymentPending || !project.isPaid) ? (
                      <Button 
                        variant="default" 
                        className="flex-1 bg-success hover:bg-success/90" 
                        onClick={() => handleApprovePayment(project.paymentId)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify & Release Revenue
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 bg-success/5 text-success border-success/20 font-black uppercase tracking-widest text-[10px]" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Payment Verified
                      </Button>
                    )
                  )}
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

      <Dialog open={!!selectedJobId} onOpenChange={(open) => !open && setSelectedJobId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Proof of Work</DialogTitle>
            <DialogDescription>
              Upload an optional photo of the completed job to notify the homeowner. Once they verify it, the job will be officially completed and you'll receive payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
              <Input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="w-8 h-8 mb-2" />
                {proofImage ? (
                  <span className="font-medium text-primary">Image Selected Ready to Submit</span>
                ) : (
                  <>
                    <span className="font-medium">Click to upload or drag and drop (Optional)</span>
                    <span className="text-xs">JPG, PNG (max. 5MB)</span>
                  </>
                )}
              </div>
            </div>
            {proofImage && (
              <div className="h-40 rounded-xl border border-border overflow-hidden">
                <img src={proofImage} alt="Proof preview" className="w-full h-full object-cover" />
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={handleSubmitProof}
              disabled={isSubmittingProof}
            >
              {isSubmittingProof ? "Submitting..." : "Submit to Homeowner"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-md rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl animate-in zoom-in-95 duration-300">
          <DialogHeader className="sr-only">
            <DialogTitle>Project Completion Celebration</DialogTitle>
          </DialogHeader>
          <div className="relative p-10 flex flex-col items-center text-center space-y-6">
            <div className="absolute inset-0 bg-gradient-to-br from-success/20 via-background to-primary/10 -z-10" />
            
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center animate-bounce shadow-2xl shadow-success/20">
              <Trophy className="w-12 h-12 text-success" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-success text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Milestone Achieved
              </Badge>
              <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
                Victory!
              </h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed pt-2">
                You've successfully completed <br/>
                <span className="text-primary font-bold">"{celebratedJob}"</span>
              </p>
            </div>

            <div className="w-full p-6 bg-muted/30 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6 text-warning" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Earnings Unlocked</p>
                <p className="text-lg font-black text-foreground">Verified & Secured</p>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
              onClick={() => setShowCelebration(false)}
            >
              Secure Your Next Win
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
