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
  Users, ClipboardList, Briefcase,
  ShieldCheck, AlertCircle, ArrowUpRight, ArrowRight
} from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 px-6 sm:px-10 lg:px-12 bg-[#f8fafc] min-h-screen">
      <Skeleton className="h-20 rounded-2xl bg-white" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl bg-white" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl bg-white" />)}
          </div>
          <Skeleton className="h-80 rounded-2xl bg-white" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl bg-white" />
          <Skeleton className="h-52 rounded-2xl bg-white" />
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
    { title: "Network Size", value: stats.totalUsers, icon: Users, description: "Active participants", trend: { value: 12, isPositive: true } },
    { title: "Project Volume", value: stats.totalJobs, icon: ClipboardList, description: "System throughput", trend: { value: 8, isPositive: true } },
    { title: "Market Activity", value: stats.totalBids, icon: Briefcase, description: "Proposals processed", trend: { value: 15, isPositive: true } },
    { title: "Gross Volume", value: `RS ${(stats.totalRevenue || 0).toLocaleString()}`, icon: PkrIcon, description: "Platform revenue", trend: { value: 5, isPositive: true } },
  ]

  return (
    <div className="space-y-10 pb-16 pt-4 animate-fade-in bg-[#f8fafc] min-h-screen px-6 sm:px-10 lg:px-12">
      
      {/* Luxury Typography Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">Executive Administration Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Intelligence Console
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-xl">
            Monitoring global platform health, user engagement, and transaction integrity in real-time.
          </p>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "User Directory", icon: Users, href: "/admin/users" },
          { label: "System Audit", icon: ClipboardList, href: "/admin/jobs" },
          { label: "Configuration", icon: ShieldCheck, href: "/admin/settings" },
          { label: "Revenue Logs", icon: PkrIcon, href: "/admin/payments" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-400 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:text-[#d4a373] group-hover:bg-[#d4a373]/5 transition-colors duration-500">
                <action.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                {action.label}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#d4a373] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {statCards.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex flex-row items-center justify-between p-8 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Global Activity Feed</h3>
                <p className="text-sm text-slate-500 font-medium">Real-time audit of system-wide project postings</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all" asChild>
                <Link href="/admin/jobs">View Complete Log</Link>
              </Button>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.recentJobs?.length > 0 ? (
                stats.recentJobs.map((job: any) => (
                  <div key={job.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-lg font-black text-slate-900">{job.clientName?.[0]}</span>
                        </div>
                        <div className="space-y-1.5">
                          <p className="font-black text-base text-slate-900 group-hover:text-[#d4a373] transition-colors">{job.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                            <span className="font-bold text-[#d4a373]">@{job.clientName}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2 shrink-0">
                        <Badge className="rounded-full px-3 py-1 text-[10px] capitalize font-bold border-0 bg-[#d4a373]/10 text-[#d4a373] tracking-widest">
                          {job.status}
                        </Badge>
                        <p className="text-lg font-black text-slate-900">RS {(job.budgetMax || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                    <AlertCircle className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <p className="text-base text-slate-500 font-medium">No recent system activity recorded.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           
           <div className="bg-white border-0 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden p-8">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4a373]/10 text-[#d4a373] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">System Health</h3>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-full">Secure</Badge>
             </div>
             <div className="space-y-8">
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-wider">Node API Status</span>
                   <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     99.9% Uptime
                   </span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#d4a373] w-[99.9%] rounded-full" />
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-wider">Database Cluster</span>
                   <span className="text-emerald-600 font-bold">Sync Verified</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#d4a373] w-full rounded-full" />
                 </div>
               </div>
             </div>
           </div>

           <div className="bg-white border-0 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden p-8">
             <div className="flex items-center gap-3 text-slate-900 pb-6 border-b border-slate-100 mb-6">
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                 <AlertCircle className="w-5 h-5" strokeWidth={2} />
               </div>
               <h3 className="text-sm font-bold uppercase tracking-widest">Queue Monitor</h3>
             </div>
             <div className="space-y-4">
               <div className="p-4 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-all">
                 <span className="text-sm font-bold text-slate-700">User KYC</span>
                 <Badge className="bg-amber-50 text-amber-600 border-0 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-full">12 Pending</Badge>
               </div>
               <div className="p-4 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-all">
                 <span className="text-sm font-bold text-slate-700">Disputes</span>
                 <Badge className="bg-slate-100 text-slate-400 border-0 text-[10px] px-3 py-1 font-bold tracking-widest uppercase rounded-full">Clear</Badge>
               </div>
             </div>
           </div>
           
        </div>
      </div>
    </div>
  )
}
