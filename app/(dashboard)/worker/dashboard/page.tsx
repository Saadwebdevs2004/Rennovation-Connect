"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/dashboard/stat-card"
import { PkrIcon } from "@/components/ui/pkr-icon"
import { fetcher } from "@/lib/api"
import {
  Briefcase, Star, TrendingUp, CheckCircle,
  ArrowRight, MessageSquare, ShieldCheck, HelpCircle,
  ClipboardList, Zap, Eye, Award
} from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-12">
      <Skeleton className="h-64 rounded-[2.5rem]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-44 rounded-[2rem]" />)}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <Skeleton className="h-52 rounded-[2.5rem]" />
          <Skeleton className="h-32 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  )
}

export default function WorkerDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState("Worker")

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(String(user.id || user.UserID || ""))
      setUserName(user.fullName || user.name || "Worker")
    }
  }, [])

  const { data: statsData, isLoading: statsLoading } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/stats/worker/${userId}`)}` : null,
    fetcher
  )

  const { data: bidsData, isLoading: bidsLoading } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/bids/worker/${userId}`)}` : null,
    fetcher
  )

  const { data: profileData, isLoading: profileLoading } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/worker/profile/${userId}`)}` : null,
    fetcher
  )

  const isLoading = !userId || statsLoading || bidsLoading || profileLoading

  const stats = [
    { title: "Earnings", value: `RS ${(statsData?.earnings ?? 0).toLocaleString()}`, icon: PkrIcon, description: "This month", trend: { value: 15, isPositive: true } },
    { title: "Active Bids", value: statsData?.activeBids ?? 0, icon: Briefcase, description: "Awaiting response", trend: { value: 2, isPositive: true } },
    { title: "Jobs Won", value: statsData?.jobsWon ?? 0, icon: CheckCircle, description: "Completed work", trend: { value: 20, isPositive: true } },
  ]

  // Extract skills from profile data or use defaults
  const rawSkills = profileData?.skills || ""
  const skillList = rawSkills ? rawSkills.split(',').map((s: string) => s.trim()) : ["Plumbing", "Carpentry", "Electrical"]
  const skills = skillList.slice(0, 3).map((name: string, i: number) => ({
    skill: name,
    level: 90 - (i * 15),
    color: i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-purple-500"
  }))

  const credentials = [
    { label: "Identity Verified", ok: !!profileData?.id },
    { label: "Background Check", ok: true },
    { label: "Tool Kit Audit", ok: skillList.length > 0 }
  ]

  const bids = Array.isArray(bidsData) ? bidsData.slice(0, 4) : []

  if (isLoading) return <DashboardSkeleton />

  const firstName = userName.split(' ')[0]

  return (
    <div className="space-y-10 animate-fade-in pb-12">

      {/* ── Premium Hero ── */}
      <div className="relative rounded-[2.5rem] p-8 lg:p-12 overflow-hidden group">
        {/* Unique gradient for Worker - shifted hue */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.42_0.18_280)] via-primary to-accent animate-gradient" />
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-colors duration-700" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
              Worker Portal
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Earnings <span className="text-white/60 italic">Console</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">
              Your bids, active jobs, and earnings — track your professional growth in real-time.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl font-black px-8 shadow-xl transition-transform hover:scale-105" asChild>
              <Link href="/worker/jobs">
                <Briefcase className="mr-2 w-5 h-5" />
                Browse Open Jobs
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-white">RS {(statsData?.earnings ?? 0).toLocaleString()}</span>
              <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Earned</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-white">{statsData?.activeBids ?? 0}</span>
                <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Bids Out</span>
              </div>
              <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-white">{statsData?.jobsWon ?? 0}</span>
                <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Won</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Action Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Browse Jobs", icon: ClipboardList, href: "/worker/jobs", color: "bg-primary" },
          { label: "My Bids", icon: Briefcase, href: "/worker/bids", color: "bg-purple-500" },
          { label: "Messages", icon: MessageSquare, href: "/worker/messages", color: "bg-rose-500" },
          { label: "My Earnings", icon: PkrIcon, href: "/worker/earnings", color: "bg-amber-500" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all group"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0", action.color)}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.title} className={`animate-fade-in animation-delay-${(i + 1) * 100}`}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Recent Bids */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              Recent Proposals
            </h2>
            <Button variant="ghost" className="font-bold text-primary gap-2" asChild>
              <Link href="/worker/bids">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="space-y-6">
            {bids.length > 0 ? (
              bids.map((bid: any) => (
                <div key={bid.id} className="glass-card rounded-[2rem] overflow-hidden group hover:scale-[1.01] transition-all">
                  <div className="p-7">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline" className={cn(
                            "rounded-lg px-3 py-1 font-bold text-xs",
                            bid.status === 'accepted' ? "bg-success/10 text-success border-success/20" :
                            bid.status === 'rejected' ? "bg-destructive/10 text-destructive border-destructive/20" :
                            "bg-primary/10 text-primary border-primary/20"
                          )}>
                            {bid.status?.toUpperCase() ?? 'PENDING'}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-semibold">Job #{bid.job_id}</span>
                        </div>
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{bid.jobTitle || `Job #${bid.job_id}`}</h3>
                        {bid.proposal_text && (
                          <p className="text-muted-foreground line-clamp-2 text-sm font-medium italic">&quot;{bid.proposal_text}&quot;</p>
                        )}
                      </div>
                      <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 min-w-[130px]">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Your Bid</p>
                          <p className="text-2xl font-black text-foreground">RS {(bid.amount || 0).toLocaleString()}</p>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-xl font-bold" asChild>
                          <Link href={`/worker/jobs/${bid.job_id}`}>
                            <Eye className="w-3.5 h-3.5 mr-1" />View Job
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 px-8 rounded-[2rem] border-2 border-dashed border-border/50 bg-muted/5">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 shadow-inner">
                  <Briefcase className="w-9 h-9 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">No Proposals Yet</h3>
                <p className="text-muted-foreground font-medium max-w-xs leading-relaxed mb-8">Explore open projects and place your first competitive bid.</p>
                <Button size="lg" className="rounded-2xl px-10 font-bold shadow-lg shadow-primary/20" asChild>
                  <Link href="/worker/jobs">Browse Job Board</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Professional Credentials */}
          <Card className="bg-primary/5 border-primary/10 rounded-[2.5rem] overflow-hidden border">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Award className="w-6 h-6" />
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Verified</Badge>
              </div>
              <CardTitle className="text-xl font-black">Pro Credentials</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-3">
              {credentials.map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-black/20 shadow-sm border border-border/50">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{item.label}</span>
                  <ShieldCheck className={cn("w-4 h-4 shrink-0", item.ok ? "text-success" : "text-muted")} />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 rounded-xl font-bold" asChild>
                <Link href="/worker/profile">Update Certifications</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Skill Strength */}
          <Card className="glass-card rounded-[2.5rem] p-8 border-none">
            <h3 className="text-xl font-black mb-6">Skill Strength</h3>
            <div className="space-y-5">
              {skills.map(skill => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{skill.skill}</span>
                    <span className="text-primary">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden border border-border/20">
                    <div className={cn("h-full rounded-full", skill.color)} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pro Insight */}
          <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-primary to-accent p-[1px] group">
            <div className="bg-background rounded-[1.95rem] p-7 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-4 h-4 text-primary fill-primary" />
                </div>
                <h3 className="text-base font-black">Win More Jobs</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Bids with a <span className="text-primary font-bold">personalized cover letter</span> win 2× more than generic proposals.
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
