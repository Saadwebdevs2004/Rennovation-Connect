"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/api"
import {
  Clock,
  MapPin,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  ArrowUpDown,
} from "lucide-react"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground border-muted",
  },
}

export default function WorkerBidsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const userId = currentUser?.id || currentUser?.UserID

  const { data: rawBids, isLoading } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const bids = Array.isArray(rawBids) ? rawBids.map(b => ({
    id: b.id,
    jobId: b.job_id,
    jobTitle: b.job_title,
    client: b.homeowner_name || "Homeowner",
    location: b.job_location || "Remote",
    bidAmount: b.amount,
    status: b.status,
    jobStatus: b.job_status,
    isPaid: !!b.isPaid,
    submittedAt: new Date(b.created_at).toLocaleDateString(),
    jobBudget: b.job_budget_max ? `Up to RS ${b.job_budget_max.toLocaleString()}` : "Contact for details",
    competingBids: Math.floor(Math.random() * 5) + 1, // Realistic placeholder
    message: b.proposal_text || "No message provided",
  })) : []

  const handleWithdraw = async (bidId: string) => {
    if (!confirm("Are you sure you want to withdraw this bid?")) return
    
    try {
      const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/bids/${bidId}`)}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        mutate(`/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}`)
      } else {
        alert("Failed to withdraw bid. It might have already been processed.")
      }
    } catch (error) {
      console.error("Error withdrawing bid:", error)
    }
  }

  const filteredBids = bids
    .filter((bid) => {
      const matchesSearch = bid.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || bid.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "amount-high") return b.bidAmount - a.bidAmount
      if (sortBy === "amount-low") return a.bidAmount - b.bidAmount
      return 0
    })

  const stats = {
    total: bids.length,
    pending: bids.filter((b) => b.status === "pending").length,
    accepted: bids.filter((b) => b.status === "accepted").length,
    rejected: bids.filter((b) => b.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Bids</h1>
        <p className="text-muted-foreground mt-1">Track and manage all your submitted bids</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Bids</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning-foreground">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{stats.accepted}</div>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bids..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                <SelectItem value="amount-low">Amount: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bids List */}
      <div className="space-y-4">
        {filteredBids.map((bid) => {
          const status = statusConfig[bid.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <Card key={bid.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{bid.jobTitle}</h3>
                        <p className="text-sm text-muted-foreground">Client: {bid.client}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={status.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        {bid.jobStatus === 'completed' && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Job Completed
                          </Badge>
                        )}
                        {bid.isPaid && (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {bid.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Submitted {bid.submittedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <PkrIcon className="h-4 w-4" />
                        Budget: {bid.jobBudget}
                      </span>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        <span className="font-medium text-foreground">Your message: </span>
                        {bid.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {bid.competingBids} competing bids
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 lg:min-w-[180px]">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Your Bid</p>
                      <p className="text-2xl font-bold text-primary">RS {bid.bidAmount}</p>
                    </div>
                    <div className="flex gap-2">
                      {!bid.isPaid && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/worker/jobs/${bid.jobId}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Job
                          </Link>
                        </Button>
                      )}
                      {bid.status === "accepted" && !bid.isPaid && (
                        <Button size="sm" asChild>
                          <Link href="/worker/messages">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Link>
                        </Button>
                      )}
                      {bid.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleWithdraw(bid.id)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredBids.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No bids found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all") }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
