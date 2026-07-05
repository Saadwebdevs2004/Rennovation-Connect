"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/stat-card"
import { PkrIcon } from "@/components/ui/pkr-icon"
import {
  ClipboardList, Users, CheckCircle,
  Plus, ArrowRight, MessageSquare, Zap,
  Briefcase, ArrowUpRight
} from "lucide-react"

interface HomeownerDashboardClientProps {
  userName: string
  statsData: any
  jobsData: any
}

export function HomeownerDashboardClient({ userName, statsData, jobsData }: HomeownerDashboardClientProps) {
  const stats = [
    { title: "Active Projects", value: statsData?.activeJobs ?? 0, icon: ClipboardList, trend: { value: 12, isPositive: true } },
    { title: "Total Proposals", value: statsData?.totalBids ?? 0, icon: Users, trend: { value: 8, isPositive: true } },
    { title: "Completed", value: statsData?.completedJobs ?? 0, icon: CheckCircle, description: "Success rate: 100%" },
    { title: "Total Investment", value: `RS ${Number(statsData?.totalSpent || 0).toLocaleString()}`, icon: PkrIcon, trend: { value: 15, isPositive: true } },
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
    <div className="space-y-10 pb-16 pt-4 animate-fade-in bg-[#f8fafc] min-h-screen px-6 sm:px-10 lg:px-12">
      
      {/* Luxury Typography Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">Private Client Workspace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Welcome back, {userName.split(' ')[0]}.
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-xl">
            You currently oversee <span className="font-bold text-slate-900">{statsData?.activeJobs || 0} active projects</span> and have <span className="font-bold text-slate-900">{statsData?.totalBids || 0} premium proposals</span> awaiting your review.
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <Button 
            size="lg" 
            className="bg-[#d4a373] text-white hover:bg-[#c29260] hover:shadow-lg hover:-translate-y-0.5 rounded-full h-12 px-8 shadow-sm transition-all duration-300 font-bold text-sm" 
            asChild
          >
            <Link href="/homeowner/jobs/new">
              <Plus className="mr-2 w-4 h-4" strokeWidth={2.5} />
              Commission Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Elegant Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Commission Job", icon: Plus, href: "/homeowner/jobs/new" },
          { label: "My Portfolio", icon: ClipboardList, href: "/homeowner/jobs" },
          { label: "Review Proposals", icon: Briefcase, href: "/homeowner/bids" },
          { label: "Private Messages", icon: MessageSquare, href: "/homeowner/messages" },
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
        
        {/* Left Columns: Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Active Portfolios
            </h2>
            <Link href="/homeowner/jobs" className="text-xs font-bold uppercase tracking-widest text-[#d4a373] hover:text-[#c29260] flex items-center transition-colors">
              View Directory <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.slice(0, 4).map((job: any) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 group"
                >
                  <div className="p-7">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4">
                          <Badge className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-0",
                            job.status === 'open' 
                              ? "bg-[#d4a373]/10 text-[#d4a373]" 
                              : "bg-emerald-50 text-emerald-600"
                          )}>
                            {job.status}
                          </Badge>
                          <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">{job.category}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-[#d4a373] transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed font-medium">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-8 pt-4 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="font-bold text-slate-700">Budget:</span>
                            <span className="font-medium">RS {job.budget.min.toLocaleString()} – {job.budget.max.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="font-bold text-slate-700">Proposals:</span>
                            <span className="font-medium">{job.bidsCount} bid(s)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <Button size="sm" className="rounded-xl h-10 px-6 w-full sm:w-32 text-xs font-bold bg-[#d4a373] text-white hover:bg-[#c29260] hover:shadow-md transition-all" asChild>
                          <Link href={`/homeowner/jobs/${job.id}`}>
                            Manage Project
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 w-full sm:w-32 text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all" asChild>
                          <Link href={`/homeowner/jobs/${job.id}/edit`}>Edit Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl bg-white border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 text-slate-300">
                  <Plus className="w-8 h-8" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Initiate Your First Project</h3>
                <p className="text-slate-500 text-base max-w-sm mb-8 font-medium">Your portfolio is currently empty. Begin by outlining your renovation requirements for our premium network.</p>
                <Button size="lg" className="rounded-full px-8 h-12 font-bold bg-[#0f172a] text-white hover:bg-[#1e293b] hover:shadow-lg transition-all" asChild>
                  <Link href="/homeowner/jobs/new">Commission New Project</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Insights & Summary */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#d4a373]/10 rounded-xl text-[#d4a373]">
                  <Zap className="w-5 h-5 fill-[#d4a373]" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Executive Insight</h3>
              </div>
              <p className="text-base text-slate-500 leading-relaxed font-medium">
                Projects with <span className="text-slate-900 font-bold">comprehensive site imagery</span> attract 3.5× more proposals from our top-tier verified professionals.
              </p>
              <Button variant="link" className="p-0 text-[#d4a373] font-bold text-sm hover:no-underline flex items-center h-auto hover:text-[#c29260] transition-colors" asChild>
                <Link href="/homeowner/jobs/new">
                  Enhance Your Listing <ArrowRight className="ml-1.5 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-6 pb-4 border-b border-slate-100">Financial Summary</h3>
            <div className="space-y-4 text-base font-medium">
              {[
                { label: "Total Investment", value: `RS ${Number(statsData?.totalSpent || 0).toLocaleString()}` },
                { label: "Active Jobs", value: statsData?.activeJobs ?? 0 },
                { label: "Completed", value: statsData?.completedJobs ?? 0 },
              ].map((item, i) => (
                <div key={item.label} className="flex justify-between items-center py-2">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={`font-bold ${i === 0 ? 'text-slate-900 text-lg' : 'text-slate-700'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all" asChild>
                <Link href="/homeowner/payments">View Ledger</Link>
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
