"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { PkrIcon } from "@/components/ui/pkr-icon"
import {
  Briefcase, CheckCircle,
  ArrowRight, MessageSquare, ShieldCheck,
  ClipboardList, Zap, Eye, Award, TrendingUp
} from "lucide-react"

interface WorkerDashboardClientProps {
  userName: string
  statsData: any
  bidsData: any
  profileData: any
}

export function WorkerDashboardClient({ userName, statsData, bidsData, profileData }: WorkerDashboardClientProps) {
  const stats = [
    { title: "Earnings", value: `RS ${Number(statsData?.earnings || 0).toLocaleString()}`, icon: PkrIcon, description: "Total Revenue", trend: { value: 15, isPositive: true } },
    { title: "Active Bids", value: statsData?.activeBids ?? 0, icon: Briefcase, description: "Pending response" },
    { title: "Jobs Won", value: statsData?.jobsWon ?? 0, icon: CheckCircle, description: "Success rate: 92%" },
  ]

  const rawSkills = profileData?.skills || ""
  const skillList = rawSkills ? rawSkills.split(',').map((s: string) => s.trim()) : ["Plumbing", "Carpentry", "Electrical"]
  const skills = skillList.slice(0, 3).map((name: string, i: number) => ({
    skill: name,
    level: 90 - (i * 15),
    color: i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-purple-500"
  }))

  const credentials = [
    { label: "Identity Verified", ok: true },
    { label: "Background Check", ok: true },
    { label: "Tools Audited", ok: true }
  ]

  const bids = Array.isArray(bidsData) ? bidsData.slice(0, 4) : []

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Premium Hero */}
      <div className="relative rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-14 overflow-hidden group shadow-2xl shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent animate-gradient" />
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-xl px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
              Professional Dashboard
            </Badge>
            <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-tight">
              Welcome, <br/><span>{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-white/80 text-xl max-w-xl font-medium leading-relaxed">
              Your expertise is in high demand. You have <span className="text-white font-bold">{statsData?.activeBids || 0} active proposals</span> on the board.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-[2rem] h-16 font-black px-10 shadow-2xl transition-all hover:-translate-y-1" asChild>
              <Link href="/worker/jobs">
                <Briefcase className="mr-3 w-6 h-6" />
                Find New Projects
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-3xl lg:text-4xl font-black text-white">RS {Number(statsData?.earnings || 0).toLocaleString()}</span>
              <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em]">Total Earned</span>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-3xl lg:text-4xl font-black text-white">{statsData?.jobsWon ?? 0}</span>
              <span className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em]">Jobs Won</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Job Board", icon: ClipboardList, href: "/worker/jobs", color: "bg-primary" },
          { label: "My Bids", icon: Briefcase, href: "/worker/bids", color: "bg-purple-500" },
          { label: "Messages", icon: MessageSquare, href: "/worker/messages", color: "bg-rose-500" },
          { label: "Earnings", icon: PkrIcon, href: "/worker/earnings", color: "bg-amber-500" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="glass-card p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3 sm:gap-5 hover:scale-[1.05] transition-all group border-border/40"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 group-hover:rotate-12 transition-transform", action.color)}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-black text-[10px] sm:text-sm uppercase tracking-widest text-foreground group-hover:text-primary transition-colors leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={stat.title} className="animate-fade-in shadow-sm hover:shadow-xl transition-shadow rounded-3xl overflow-hidden">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
              <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_15px_oklch(0.5_0.18_250)]" />
              Recent Proposals
            </h2>
            <Button variant="ghost" className="font-black text-primary gap-2 hover:bg-primary/5 uppercase tracking-widest text-xs" asChild>
              <Link href="/worker/bids">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {bids.length > 0 ? (
              bids.map((bid: any) => (
                <div key={bid.id} className="glass-card rounded-[3rem] overflow-hidden group hover:bg-white dark:hover:bg-black/40 transition-all border-border/30">
                  <div className="p-8 lg:p-10">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <Badge className="rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary border-none">
                            {bid.status || 'Active'}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Project #{bid.job_id}</span>
                        </div>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">{bid.jobTitle || `Bid on Project #${bid.job_id}`}</h3>
                        <p className="text-muted-foreground line-clamp-2 text-base font-medium italic opacity-70">&quot;{bid.proposal_text || 'Premium quality work guaranteed with timeline adherence.'}&quot;</p>
                      </div>
                      <div className="flex items-center md:items-end justify-between md:flex-col gap-4">
                        <div className="md:text-right">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mb-1">Your Quote</p>
                          <p className="text-3xl font-black text-foreground">RS {Number(bid.amount || 0).toLocaleString()}</p>
                        </div>
                        <Button className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.05]" asChild>
                          <Link href={bid.status === 'accepted' ? "/worker/projects" : `/worker/jobs/${bid.job_id}`}>
                            {bid.status === 'accepted' ? 'Track Project' : 'View Bid'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 px-10 rounded-[4rem] border-4 border-dashed border-border/20 bg-muted/5">
                <Briefcase className="w-16 h-16 text-muted/20 mb-8" />
                <h3 className="text-2xl font-black text-foreground mb-3">Launch Your Business</h3>
                <p className="text-muted-foreground font-medium max-w-sm mb-10 leading-relaxed">Your professional portfolio is ready. Start bidding on projects in your area.</p>
                <Button size="lg" className="rounded-[2rem] px-12 h-16 font-black shadow-2xl shadow-primary/20" asChild>
                  <Link href="/worker/jobs">Explore Job Board</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <Card className="bg-foreground text-background rounded-[3rem] overflow-hidden border-none shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Award className="w-32 h-32 rotate-12" />
            </div>
            <CardHeader className="p-10 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-black">Professional Trust</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-4">
              {credentials.map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{item.label}</span>
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
              ))}
              <Button variant="secondary" className="w-full mt-6 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-white text-foreground hover:bg-white/90">
                Manage Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[3rem] p-10 space-y-8 border-border/30">
            <h3 className="text-xl font-black uppercase tracking-widest">Skill Mastery</h3>
            <div className="space-y-8">
              {skills.map((skill: any) => (
                <div key={skill.skill} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                    <span>{skill.skill}</span>
                    <span className="text-primary">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/10">
                    <div className={cn("h-full rounded-full transition-all duration-1000", skill.color)} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
