"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  CheckCircle,
  X,
  Clock,
  MapPin,
  Shield,
} from "lucide-react"

interface Bid {
  id: string
  jobId: string
  jobTitle: string
  professional: {
    id: string
    name: string
    avatar: string
    rating: number
    reviewsCount: number
    completedJobs: number
    verified: boolean
  }
  amount: number
  message: string
  estimatedDays: number
  submittedAt: string
  status: "pending" | "accepted" | "rejected"
  jobStatus?: string
  isPaid?: boolean
}

export default function HomeownerBidsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const userId = currentUser?.id || currentUser?.UserID

  const { data: rawBids, isLoading } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/bids/homeowner/${userId}`)}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const bids: Bid[] = Array.isArray(rawBids) ? rawBids.map(b => ({
    id: String(b.id),
    jobId: String(b.job_id),
    jobTitle: b.job_title,
    professional: {
      id: String(b.worker_id),
      name: b.worker_name || "Professional",
      avatar: b.worker_name ? b.worker_name.substring(0, 2).toUpperCase() : "PR",
      rating: b.worker_rating || 4.8,
      reviewsCount: b.worker_reviews || 12,
      completedJobs: b.worker_jobs_completed || 24,
      verified: true,
    },
    amount: b.amount,
    message: b.proposal_text || "No message provided.",
    estimatedDays: b.estimated_days || 7,
    submittedAt: new Date(b.created_at).toLocaleDateString(),
    status: b.status,
    jobStatus: b.job_status,
    isPaid: !!b.isPaid,
  })) : []

  const handleBidStatus = async (bidId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/bids/${bidId}/status`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        // Refresh bids locally
        mutate(`/api/proxy?path=${encodeURIComponent(`/api/bids/homeowner/${userId}`)}`)
      }
    } catch (error) {
      console.error("Failed to update bid status:", error)
    }
  }

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && bid.status === activeTab
  })

  const groupedBids = filteredBids.reduce((acc, bid) => {
    if (!acc[bid.jobTitle]) {
      acc[bid.jobTitle] = []
    }
    acc[bid.jobTitle].push(bid)
    return acc
  }, {} as Record<string, Bid[]>)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">View Bids</h1>
        <p className="text-muted-foreground mt-1">Review and manage bids from professionals</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bids by professional or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="w-fit sm:w-full flex justify-start sm:justify-center min-w-max bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="pending" className="rounded-lg px-4 py-2">Pending ({bids.filter(b => b.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="accepted" className="rounded-lg px-4 py-2">Accepted ({bids.filter(b => b.status === "accepted").length})</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-lg px-4 py-2">Rejected ({bids.filter(b => b.status === "rejected").length})</TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg px-4 py-2">All ({bids.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6 space-y-8">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 w-full bg-muted animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : Object.keys(groupedBids).length > 0 ? (
            Object.entries(groupedBids).map(([jobTitle, jobBids]) => (
              <div key={jobTitle}>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  {jobTitle}
                  <Badge variant="secondary">{jobBids.length} bids</Badge>
                </h2>
                <div className="grid gap-4">
                  {jobBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} onStatusChange={handleBidStatus} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border/50">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No bids found</h3>
              <p className="text-muted-foreground mt-2">Adjust your filters or wait for new proposals.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BidCard({ bid, onStatusChange }: { bid: Bid, onStatusChange: (id: string, status: 'accepted' | 'rejected') => void }) {
  return (
    <div className="bg-card rounded-[2rem] border border-border/50 p-6 sm:p-8 hover:border-primary/30 hover:shadow-xl transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Professional Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg shrink-0">
            {bid.professional.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-card-foreground">{bid.professional.name}</h3>
              {bid.professional.verified && (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span>{bid.professional.rating}</span>
                <span>({bid.professional.reviewsCount} reviews)</span>
              </div>
              <span>{bid.professional.completedJobs} jobs completed</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {bid.message}
            </p>
          </div>
        </div>

        {/* Bid Details */}
        <div className="flex flex-col items-start lg:items-end gap-3 lg:text-right">
          <div>
            <p className="text-2xl font-bold text-primary">RS {bid.amount.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{bid.estimatedDays} days</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{bid.submittedAt}</p>
        </div>
      </div>

      {/* Actions */}
      {bid.status === "pending" && (
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/homeowner/messages?contactId=${bid.professional.id}&name=${encodeURIComponent(bid.professional.name)}&jobId=${bid.jobId}`}>
              <MessageSquare className="mr-2 w-4 h-4" />
              Message
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onStatusChange(bid.id, 'rejected')}
          >
            <X className="mr-2 w-4 h-4" />
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => onStatusChange(bid.id, 'accepted')}
          >
            <CheckCircle className="mr-2 w-4 h-4" />
            Accept Bid
          </Button>
        </div>
      )}

      {bid.status === "accepted" && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Accepted
            </Badge>
            {bid.jobStatus === 'completed' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Project Completed
              </Badge>
            )}
            {bid.isPaid && (
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Paid
              </Badge>
            )}
          </div>
          {!bid.isPaid && (
            <Button size="sm" asChild>
              <Link href={`/homeowner/messages?contactId=${bid.professional.id}&name=${encodeURIComponent(bid.professional.name)}&jobId=${bid.jobId}`}>
                <MessageSquare className="mr-2 w-4 h-4" />
                Contact Professional
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
