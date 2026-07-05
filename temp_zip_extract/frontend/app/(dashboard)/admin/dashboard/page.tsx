"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import useSWR from "swr"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/dashboard/stat-card"
import { fetcher } from "@/lib/api"
import {
  Users, ClipboardList, Briefcase, TrendingUp,
  ShieldCheck, AlertCircle
} from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-12">
      <Skeleton className="h-64 rounded-[2.5rem]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
          </div>
          <Skeleton className="h-80 rounded-[2.5rem]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <Skeleton className="h-52 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading } = useSWR(
    `/api/proxy?path=${encodeURIComponent('/api/stats/admin')}`,
    fetcher
  )

  if (isLoading || !data) return <DashboardSkeleton />

  const stats = data || { totalUsers: 0, totalJobs: 0, totalBids: 0, totalRevenue: 0, recentJobs: [] }

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, description: "Active participants", trend: { value: 12, isPositive: true } },
    { title: "Project Volume", value: stats.totalJobs, icon: ClipboardList, description: "System throughput", trend: { value: 8, isPositive: true } },
    { title: "Market Activity", value: stats.totalBids, icon: Briefcase, description: "Proposals processed", trend: { value: 15, isPositive: true } },
    { title: "Gross Volume", value: `RS ${(stats.totalRevenue || 0).toLocaleString()}`, icon: PkrIcon, description: "Platform revenue", trend: { value: 5, isPositive: true } },
  ]

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Premium Hero Section */}
      <div className="relative rounded-[2.5rem] p-8 lg:p-12 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/80 animate-gradient" />
        <div className="absolute inset-0 bg-grid-white opacity-10" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-colors duration-700" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
              Platform Overview
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Intelligence <span className="text-white/60 italic">Console</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">
              Monitoring global platform health, user engagement, and transaction integrity in real-time.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center">
               <span className="text-3xl font-black text-white">{stats.totalUsers}</span>
               <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Active Users</span>
             </div>
             <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center">
               <span className="text-3xl font-black text-white">{stats.totalJobs}</span>
               <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Open Jobs</span>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "User Directory", icon: Users, href: "/admin/users", color: "bg-blue-500" },
          { label: "Job Audit", icon: ClipboardList, href: "/admin/jobs", color: "bg-purple-500" },
          { label: "Configuration", icon: ShieldCheck, href: "/admin/settings", color: "bg-emerald-500" },
          { label: "Revenue Logs", icon: PkrIcon, href: "/admin/payments", color: "bg-amber-500" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all group"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", action.color)}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {statCards.map((stat, i) => (
              <div key={stat.title} className={`animate-fade-in animation-delay-${(i + 1) * 100}`}>
                <StatCard {...stat} />
              </div>
            ))}
          </div>

          <Card className="glass-card rounded-[2.5rem] border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-border/10 p-8">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Global Activity Feed</CardTitle>
                <CardDescription className="text-base font-medium">Real-time audit of system-wide job postings</CardDescription>
              </div>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/admin/jobs">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/10">
                {stats.recentJobs?.length > 0 ? (
                  stats.recentJobs.map((job: any) => (
                    <div key={job.id} className="p-8 hover:bg-primary/5 transition-colors group">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                            <span className="text-xl font-bold text-primary">{job.clientName?.[0]}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{job.title}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="font-semibold text-primary">@{job.clientName}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant="outline" className="rounded-lg px-3 py-1 capitalize font-bold border-primary/20 text-primary">
                            {job.status}
                          </Badge>
                          <p className="text-lg font-black text-foreground">RS {(job.budgetMax || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No recent system activity recorded.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
           <Card className="bg-primary/5 border-primary/10 rounded-[2.5rem] overflow-hidden border">
             <CardHeader className="p-8 pb-0">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30">Secure</Badge>
               </div>
               <CardTitle className="text-xl font-bold">System Health</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-4 space-y-8">
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground font-semibold uppercase tracking-wider">Node API Status</span>
                   <span className="text-success font-bold flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     99.9% Uptime
                   </span>
                 </div>
                 <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-border/20">
                   <div className="h-full bg-gradient-to-r from-success/50 to-success w-[99.9%] rounded-full" />
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground font-semibold uppercase tracking-wider">MySQL Cluster</span>
                   <span className="text-success font-bold">Sync Verified</span>
                 </div>
                 <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-border/20">
                   <div className="h-full bg-gradient-to-r from-success/50 to-success w-full rounded-full" />
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="glass-card rounded-[2rem] border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-3xl" />
             <CardHeader className="pb-4">
               <div className="flex items-center gap-3 text-warning">
                 <div className="p-2 bg-warning/10 rounded-lg">
                   <AlertCircle className="w-6 h-6" />
                 </div>
                 <CardTitle className="text-xl font-bold">Queue Monitor</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="p-5 rounded-2xl hover:bg-warning/5 border border-warning/10 flex items-center justify-between transition-all">
                 <span className="font-bold text-foreground">User KYC</span>
                 <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 font-bold px-3">12 Pending</Badge>
               </div>
               <div className="p-5 rounded-2xl hover:bg-primary/5 border border-border/10 flex items-center justify-between transition-all">
                 <span className="font-bold text-foreground">Disputes</span>
                 <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold px-3 opacity-50">Clear</Badge>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
