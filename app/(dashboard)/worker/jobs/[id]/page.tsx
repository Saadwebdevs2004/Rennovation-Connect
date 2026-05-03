"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, ArrowLeft } from "lucide-react"
import { PkrIcon } from "@/components/ui/pkr-icon"

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
    return <div className="p-8 text-center">Loading job details...</div>
  }

  if (!job) {
    return <div className="p-8 text-center text-destructive">Job not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">{job.category}</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {job.status || 'Open'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PkrIcon className="w-4 h-4" />
                  RS {job.budgetMin} - RS {job.budgetMax}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Place Bid Form */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Submit a Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Bid Amount (RS)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    required 
                    placeholder="e.g. 5000" 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter / Proposal</label>
                  <Textarea 
                    required 
                    placeholder="Explain why you are the best fit for this job..."
                    className="min-h-[150px]"
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Place Bid"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
