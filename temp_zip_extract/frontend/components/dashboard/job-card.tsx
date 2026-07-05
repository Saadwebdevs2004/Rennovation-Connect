"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Job {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget: {
    min: number
    max: number
  }
  bidsCount: number
  status: "open" | "in_progress" | "completed" | "cancelled"
  postedAt: string
  deadline?: string
  hasBidded?: boolean
  isPaid?: boolean
  progress_status?: string
}

interface JobCardProps {
  job: Job
  variant?: "homeowner" | "worker"
  className?: string
}

const statusConfig = {
  open: { label: "Open", className: "bg-success/10 text-success border-success/20" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground border-muted" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

const categoryIcons: Record<string, string> = {
  plumbing: "🔧",
  electrical: "⚡",
  carpentry: "🪚",
  painting: "🎨",
  roofing: "🏠",
  hvac: "❄️",
  bathroom: "🚿",
  kitchen: "🍳",
  general: "🏗️",
}

export function JobCard({ job, variant = "homeowner", className }: JobCardProps) {
  const status = statusConfig[job.status]
  const icon = categoryIcons[job.category.toLowerCase()] || categoryIcons.general

  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border p-4 sm:p-5 hover:border-primary/30 hover:shadow-lg transition-all group",
      className
    )}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.category}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn("shrink-0", status.className)}>
          {status.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PkrIcon className="w-4 h-4" />
          <span>RS {Number(job.budget.min || 0).toLocaleString()} - RS {Number(job.budget.max || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{job.bidsCount} bids</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{job.postedAt}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        {variant === "homeowner" ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/homeowner/jobs/${job.id}`}>View Details</Link>
            </Button>
            {job.status === "open" ? (
              <Button size="sm" asChild>
                <Link href={`/homeowner/bids`}>
                  View Bids ({job.bidsCount})
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            ) : job.progress_status === "Pending Verification" ? (
              <Button size="sm" className="bg-warning hover:bg-warning/90 text-warning-foreground shadow-lg shadow-warning/20 animate-pulse" asChild>
                <Link href={`/homeowner/jobs/${job.id}`}>
                  Review & Verify
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            ) : (job.isPaid && job.status === "completed") ? (
              <Button size="sm" variant="outline" className="bg-success/10 text-success border-success/20 font-black uppercase tracking-widest text-[10px] h-10" disabled>
                Paid & Completed
                <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
            ) : job.isPaid ? (
              <Button size="sm" variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20 animate-pulse font-black uppercase tracking-widest text-[10px] h-10" disabled>
                Verifying Payment...
                <Clock className="ml-2 w-3 h-3" />
              </Button>
            ) : (
              <Button size="sm" className="font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-primary/20" asChild>
                <Link href={`/homeowner/payments/pay/${job.id}`}>
                  Make Payment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="text-lg font-bold text-primary">
              RS {Number(job.budget.min || 0).toLocaleString()} - RS {Number(job.budget.max || 0).toLocaleString()}
            </div>
            {job.hasBidded ? (
              <Button size="sm" variant="secondary" disabled>
                Bid Submitted
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href={`/worker/jobs/${job.id}`}>
                  Place Bid
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
