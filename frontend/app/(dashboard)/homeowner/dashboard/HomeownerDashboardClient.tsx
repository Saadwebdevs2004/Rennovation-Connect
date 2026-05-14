"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { PkrIcon } from "@/components/ui/pkr-icon"
import {
  ClipboardList, Users, CheckCircle,
  Plus, ArrowRight, MessageSquare, Zap,
  Briefcase, Star, TrendingUp, Eye
} from "lucide-react"

interface HomeownerDashboardClientProps {
  userName: string
  statsData: any
  jobsData: any
}

export function HomeownerDashboardClient({ userName, statsData, jobsData }: HomeownerDashboardClientProps) {
  const stats = [
    { title: "Active Jobs", value: statsData?.activeJobs ?? 0, icon: ClipboardList, trend: { value: 12, isPositive: true } },
    { title: "Total Bids", value: statsData?.totalBids ?? 0, icon: Users, trend: { value: 8, isPositive: true } },
    { title: "Completed", value: statsData?.completedJobs ?? 0, icon: CheckCircle, description: "Success rate: 100%" },
    { title: "Total Spent", value: `RS ${Number(statsData?.totalSpent || 0).toLocaleString()}`, icon: PkrIcon, trend: { value: 15, isPositive: true } },
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
    postedAt: new Date(row.created_at).toLocaleDateString(),
  })) : []

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Premium Hero */}
      <div className="relative rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-14 overflow-hidden group shadow-2xl shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/80 animate-gradient" />
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-xl px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
              Project Control Center
            </Badge>
            <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-tight">
              Welcome, <br/><span>{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-white/80 text-xl max-w-xl font-medium leading-relaxed">
              You have <span className="text-white font-bold">{statsData?.activeJobs || 0} projects</span> active and <span className="text-white font-bold">{statsData?.totalBids || 0} bids</span> awaiting review.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-[2rem] h-16 font-black px-10 shadow-2xl transition-all hover:-translate-y-1" asChild>
              <Link href="/homeowner/jobs/new">
                <Plus className="mr-3 w-6 h-6" />
                Launch New Project
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-4xl font-black text-white">{statsData?.activeJobs ?? 0}</span>
              <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em]">Active</span>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-4xl font-black text-white">{statsData?.totalBids ?? 0}</span>
              <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em]">Bids In</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Post a Job", icon: Plus, href: "/homeowner/jobs/new", color: "bg-primary" },
          { label: "My Projects", icon: ClipboardList, href: "/homeowner/jobs", color: "bg-purple-500" },
          { label: "Review Bids", icon: Briefcase, href: "/homeowner/bids", color: "bg-emerald-500" },
          { label: "Messages", icon: MessageSquare, href: "/homeowner/messages", color: "bg-rose-500" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="glass-card p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3 sm:gap-5 hover:scale-[1.05] transition-all group border-border/40"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0", action.color)}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-black text-[10px] sm:text-sm uppercase tracking-widest text-foreground group-hover:text-primary transition-colors leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={stat.title} className="animate-fade-in shadow-sm hover:shadow-xl transition-shadow rounded-3xl overflow-hidden">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
              <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_15px_oklch(0.5_0.18_250)]" />
              Active Projects
            </h2>
            <Button variant="ghost" className="font-black text-primary gap-2 hover:bg-primary/5 uppercase tracking-widest text-xs" asChild>
              <Link href="/homeowner/jobs">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {jobs.length > 0 ? (
              jobs.slice(0, 4).map((job: any) => (
                <div key={job.id} className="glass-card rounded-[3rem] overflow-hidden group hover:bg-white dark:hover:bg-black/40 transition-all border-border/30">
                  <div className="p-8 lg:p-10">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <Badge className={cn(
                            "rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none",
                            job.status === 'open' ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                          )}>
                            {job.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">{job.category}</span>
                        </div>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 text-base font-medium opacity-70 leading-relaxed">{job.description}</p>
                        <div className="flex flex-wrap gap-8 pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                              <PkrIcon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-black text-sm">RS {job.budget.min.toLocaleString()} – {job.budget.max.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-black text-sm">{job.bidsCount} Proposals</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center md:items-end justify-between md:flex-col gap-4 min-w-[160px]">
                        <Button className="rounded-[1.5rem] font-black uppercase tracking-widest text-xs h-14 px-10 shadow-xl shadow-primary/20" asChild>
                          <Link href={`/homeowner/jobs/${job.id}`}>
                            <Eye className="w-4 h-4 mr-2" />Manage
                          </Link>
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold h-12 px-6" asChild>
                          <Link href={`/homeowner/jobs/${job.id}/edit`}>Edit Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 px-10 rounded-[4rem] border-4 border-dashed border-border/20 bg-muted/5">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8 shadow-inner">
                  <Plus className="w-12 h-12 text-muted/20" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-3">Start Your Vision</h3>
                <p className="text-muted-foreground font-medium max-w-sm mb-10 leading-relaxed">No active projects found. Let's start by posting your renovation requirements.</p>
                <Button size="lg" className="rounded-[2rem] px-12 h-16 font-black shadow-2xl shadow-primary/20" asChild>
                  <Link href="/homeowner/jobs/new">Post New Project</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <Card className="rounded-[3rem] border-none bg-gradient-to-br from-primary to-accent p-[1px] group">
            <div className="bg-background rounded-[2.95rem] p-10 relative overflow-hidden h-full">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Zap className="w-6 h-6 text-primary fill-primary" />
                </div>
                <h3 className="text-xl font-black">Pro Insight</h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                Projects with <span className="text-primary font-bold">clear site photos</span> receive 3.5× more bids from verified professionals.
              </p>
              <Button variant="link" className="mt-6 p-0 text-primary font-black uppercase tracking-widest text-xs hover:no-underline" asChild>
                <Link href="/homeowner/jobs/new">Boost Your Project <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </Card>

          <Card className="glass-card rounded-[3rem] p-10 space-y-10 border-border/30">
            <h3 className="font-black text-sm uppercase tracking-[0.3em] text-primary">Financial Summary</h3>
            <div className="space-y-6">
              {[
                { label: "Total Investment", value: `RS ${Number(statsData?.totalSpent || 0).toLocaleString()}` },
                { label: "Active Jobs", value: statsData?.activeJobs ?? 0 },
                { label: "Completed", value: statsData?.completedJobs ?? 0 },
              ].map(item => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border/10 last:border-0">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1 sm:mb-0">{item.label}</span>
                  <span className="font-black text-foreground text-base sm:text-lg">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2" asChild>
              <Link href="/homeowner/payments">Financial History</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
