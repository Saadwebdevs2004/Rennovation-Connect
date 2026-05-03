"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/dashboard/stat-card"
import { PkrIcon } from "@/components/ui/pkr-icon"
import { fetcher } from "@/lib/api"
import {
  ClipboardList, Users, CheckCircle,
  Plus, ArrowRight, MessageSquare, Zap,
  Briefcase, Star, TrendingUp, Eye
} from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-12">
      <Skeleton className="h-64 rounded-[2.5rem]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-[2rem]" />)}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <Skeleton className="h-48 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  )
}

export default function HomeownerDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState("Homeowner")

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(String(user.id || user.UserID || ""))
      setUserName(user.fullName || user.name || "Homeowner")
    }
  }, [])

  const { data: statsData, error: statsError } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/stats/homeowner/${userId}`)}` : null,
    fetcher
  )

  const { data: jobsData, error: jobsError } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/jobs/homeowner/${userId}`)}` : null,
    fetcher
  )

  const isStatsLoading = !statsData && !statsError && userId;
  const isJobsLoading = !jobsData && !jobsError && userId;

  const isLoading = !userId || isStatsLoading || isJobsLoading;

  const stats = [
    { title: "Active Jobs", value: statsData?.activeJobs ?? 0, icon: ClipboardList, trend: { value: 12, isPositive: true } },
    { title: "Total Bids", value: statsData?.totalBids ?? 0, icon: Users, trend: { value: 8, isPositive: true } },
    { title: "Completed", value: statsData?.completedJobs ?? 0, icon: CheckCircle, description: "Projects this year" },
    { title: "Total Spent", value: `RS ${(statsData?.totalSpent ?? 0).toLocaleString()}`, icon: PkrIcon, trend: { value: 15, isPositive: true } },
  ]

  const jobs = Array.isArray(jobsData) ? jobsData.map((row: any) => ({
    id: String(row.id),
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    budget: { min: row.budgetMin || 0, max: row.budgetMax || 0 },
    bidsCount: row.bidsCount || 0,
    status: row.status || "open",
    isPaid: !!row.isPaid,
    postedAt: new Date(row.created_at).toLocaleDateString(),
  })) : []

  if (isLoading) return <DashboardSkeleton />

  const firstName = userName.split(' ')[0]

  return (
    <div className="space-y-10 animate-fade-in pb-12">

      {/* ── Premium Hero ── */}
      <div className="relative rounded-[2.5rem] p-8 lg:p-12 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/80 animate-gradient" />
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-colors duration-700" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
              Homeowner Portal
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Project <span className="text-white/60 italic">Command</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">
              Your renovation projects, bids, and workers — all in one powerful place.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl font-black px-8 shadow-xl transition-transform hover:scale-105" asChild>
              <Link href="/homeowner/jobs/new">
                <Plus className="mr-2 w-5 h-5" />
                Launch New Project
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center gap-1">
              <span className="text-4xl font-black text-white">{statsData?.activeJobs ?? 0}</span>
              <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Active Jobs</span>
            </div>
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center gap-1">
              <span className="text-4xl font-black text-white">{statsData?.totalBids ?? 0}</span>
              <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Bids In</span>
            </div>
            <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center gap-1">
              <span className="text-4xl font-black text-white">{statsData?.completedJobs ?? 0}</span>
              <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Action Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Post a Job", icon: Plus, href: "/homeowner/jobs/new", color: "bg-primary" },
          { label: "My Projects", icon: ClipboardList, href: "/homeowner/jobs", color: "bg-purple-500" },
          { label: "Incoming Bids", icon: Briefcase, href: "/homeowner/bids", color: "bg-emerald-500" },
          { label: "Messages", icon: MessageSquare, href: "/homeowner/messages", color: "bg-rose-500" },
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.title} className={`animate-fade-in animation-delay-${(i + 1) * 100}`}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              Active Projects
            </h2>
            <Button variant="ghost" className="font-bold text-primary gap-2" asChild>
              <Link href="/homeowner/jobs">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.slice(0, 4).map((job: any) => (
                <div key={job.id} className="glass-card rounded-[2rem] overflow-hidden group hover:scale-[1.01] transition-all">
                  <div className="p-7">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className={cn(
                            "rounded-lg px-3 py-1 font-bold text-xs border-none",
                            job.status === 'open' ? "bg-primary/10 text-primary" :
                            job.status === 'completed' ? "bg-success/10 text-success" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {job.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-semibold">{job.category}</span>
                          <span className="text-xs text-muted-foreground">• {job.postedAt}</span>
                        </div>
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 text-sm font-medium">{job.description}</p>
                        <div className="flex flex-wrap gap-5 pt-1">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                              <PkrIcon className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="font-bold">RS {job.budget.min.toLocaleString()} – {job.budget.max.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                              <Users className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="font-bold">{job.bidsCount} Proposals</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col justify-start gap-3 min-w-[140px]">
                        <Button className="rounded-xl font-bold shadow-md shadow-primary/20 flex-1 md:flex-none" asChild>
                          <Link href={`/homeowner/jobs/${job.id}`}>
                            <Eye className="w-4 h-4 mr-2" />Manage
                          </Link>
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold flex-1 md:flex-none" asChild>
                          <Link href={`/homeowner/jobs/${job.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 px-8 rounded-[2rem] border-2 border-dashed border-border/50 bg-muted/5">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 shadow-inner">
                  <Plus className="w-9 h-9 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground font-medium max-w-xs leading-relaxed mb-8">Start your renovation journey by posting your first project.</p>
                <Button size="lg" className="rounded-2xl px-10 font-bold shadow-lg shadow-primary/20" asChild>
                  <Link href="/homeowner/jobs/new">Post a Job Now</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Spending Overview */}
          <Card className="bg-primary/5 border-primary/10 rounded-[2.5rem] overflow-hidden border">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
              </div>
              <CardTitle className="text-xl font-black">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-5">
              {[
                { label: "Project Success", pct: Math.min(100, Math.round(((statsData?.completedJobs || 0) / Math.max(1, (statsData?.activeJobs || 0) + (statsData?.completedJobs || 0))) * 100)), color: "bg-success" },
                { label: "Market Activity", pct: Math.min(100, Math.round(((statsData?.totalBids || 0) / Math.max(1, ((statsData?.activeJobs || 0) + (statsData?.completedJobs || 0)) * 5)) * 100)), color: "bg-primary" },
                { label: "Spending Health", pct: 100, color: "bg-accent" },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                    <span>{item.label}</span>
                    <span>{item.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden border border-border/20">
                    <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Insight */}
          <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-primary to-accent p-[1px] group">
            <div className="bg-background rounded-[1.95rem] p-7 h-full relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-5 h-5 text-primary fill-primary" />
                </div>
                <h3 className="text-lg font-black text-foreground">Pro Insight</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Jobs with <span className="text-primary font-bold">photos and clear budgets</span> receive 3× more qualified bids within 24 hours.
              </p>
              <Button variant="link" className="mt-4 p-0 text-primary font-bold hover:no-underline text-sm" asChild>
                <Link href="/homeowner/jobs/new">Post a detailed job <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </div>
          </Card>

          {/* Payment Summary */}
          <div className="glass-card rounded-[2rem] p-7 space-y-4">
            <h3 className="font-black text-base">Financial Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Total Invested", value: `RS ${(statsData?.totalSpent ?? 0).toLocaleString()}` },
                { label: "Projects Active", value: statsData?.activeJobs ?? 0 },
                { label: "Projects Done", value: statsData?.completedJobs ?? 0 },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{item.label}</span>
                  <span className="font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-xl font-bold" asChild>
              <Link href="/homeowner/payments">View Payments</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}