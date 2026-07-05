"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/stat-card"
import { PkrIcon } from "@/components/ui/pkr-icon"
import {
  Briefcase, CheckCircle,
  ArrowRight, MessageSquare, ShieldCheck,
  ClipboardList, ArrowUpRight
} from "lucide-react"

interface WorkerDashboardClientProps {
  userName: string
  statsData: any
  bidsData: any
  profileData: any
}

export function WorkerDashboardClient({ userName, statsData, bidsData, profileData }: WorkerDashboardClientProps) {
  const stats = [
    { title: "Gross Revenue", value: `RS ${Number(statsData?.earnings || 0).toLocaleString()}`, icon: PkrIcon, description: "Total Earnings", trend: { value: 15, isPositive: true } },
    { title: "Pending Proposals", value: statsData?.activeBids ?? 0, icon: Briefcase, description: "Awaiting client review" },
    { title: "Projects Awarded", value: statsData?.jobsWon ?? 0, icon: CheckCircle, description: "Success rate: 92%" },
  ]

  const rawSkills = profileData?.skills || ""
  const skillList = rawSkills ? rawSkills.split(',').map((s: string) => s.trim()) : ["Master Plumbing", "Custom Carpentry", "Electrical Engineering"]
  const skills = skillList.slice(0, 3).map((name: string, i: number) => ({
    skill: name,
    level: 95 - (i * 10),
    color: i === 0 ? "bg-[#d4a373]" : i === 1 ? "bg-[#0f172a]" : "bg-slate-300"
  }))

  const credentials = [
    { label: "Identity Verified", ok: true },
    { label: "Background Clearance", ok: true },
    { label: "Quality Audit Passed", ok: true }
  ]

  const bids = Array.isArray(bidsData) ? bidsData.slice(0, 4) : []

  return (
    <div className="space-y-10 pb-16 pt-4 animate-fade-in bg-[#f8fafc] min-h-screen px-6 sm:px-10 lg:px-12">
      
      {/* Luxury Typography Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">Professional Network Workspace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Welcome, {userName.split(' ')[0]}.
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-xl">
            Your elite profile is active. You currently have <span className="font-bold text-slate-900">{statsData?.activeBids || 0} active proposals</span> under consideration.
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <Button 
            size="lg" 
            className="bg-[#0f172a] text-white hover:bg-[#1e293b] hover:shadow-lg hover:-translate-y-0.5 rounded-full h-12 px-8 shadow-sm transition-all duration-300 font-bold text-sm" 
            asChild
          >
            <Link href="/worker/jobs">
              <Briefcase className="mr-2 w-4 h-4" strokeWidth={2.5} />
              Explore Commissions
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Elegant Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Commission Board", icon: ClipboardList, href: "/worker/jobs" },
          { label: "My Proposals", icon: Briefcase, href: "/worker/bids" },
          { label: "Client Messages", icon: MessageSquare, href: "/worker/messages" },
          { label: "Ledger", icon: PkrIcon, href: "/worker/earnings" },
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

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        
        {/* Left Columns: Recent Proposals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Recent Submissions
            </h2>
            <Link href="/worker/bids" className="text-xs font-bold uppercase tracking-widest text-[#d4a373] hover:text-[#c29260] flex items-center transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {bids.length > 0 ? (
              bids.map((bid: any) => (
                <div 
                  key={bid.id} 
                  className="bg-white rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 group"
                >
                  <div className="p-7">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4">
                          <Badge className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-0",
                            bid.status === 'accepted' ? "bg-emerald-50 text-emerald-600" : "bg-[#d4a373]/10 text-[#d4a373]"
                          )}>
                            {bid.status || 'Active'}
                          </Badge>
                          <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Commission #{bid.job_id}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-[#d4a373] transition-colors">
                          {bid.jobTitle || `Bid on Commission #${bid.job_id}`}
                        </h3>
                        <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed font-medium italic">
                          "{bid.proposal_text || 'Premium quality work guaranteed with strict adherence to timeline and architectural standards.'}"
                        </p>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="sm:text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Submitted Quote</p>
                          <p className="text-2xl font-black text-slate-900">RS {Number(bid.amount || 0).toLocaleString()}</p>
                        </div>
                        <Button size="sm" className="rounded-xl h-10 px-6 w-full sm:w-32 text-xs font-bold bg-[#d4a373] text-white hover:bg-[#c29260] hover:shadow-md transition-all" asChild>
                          <Link href={bid.status === 'accepted' ? "/worker/projects" : `/worker/jobs/${bid.job_id}`}>
                            {bid.status === 'accepted' ? 'Track Progress' : 'View Details'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl bg-white border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 text-slate-300">
                  <Briefcase className="w-8 h-8" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Secure Your First Commission</h3>
                <p className="text-slate-500 text-base max-w-sm mb-8 font-medium">Your premium profile is established. Begin exploring the job board to find high-end renovation projects.</p>
                <Button size="lg" className="rounded-full px-8 h-12 font-bold bg-[#0f172a] text-white hover:bg-[#1e293b] hover:shadow-lg transition-all" asChild>
                  <Link href="/worker/jobs">Explore Opportunities</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Credentials & Skills */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4a373]" /> Trust Framework
            </h3>
            <div className="space-y-3">
              {credentials.map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-[#f8fafc] border border-slate-100">
                  <span className="text-xs text-slate-700 font-bold uppercase tracking-wider">{item.label}</span>
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500" strokeWidth={2.5} />
                </div>
              ))}
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all" asChild>
                <Link href="/worker/profile">Update Credentials</Link>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-6 pb-4 border-b border-slate-100">Mastery Matrix</h3>
            <div className="space-y-5">
              {skills.map((skill: any) => (
                <div key={skill.skill} className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-700">{skill.skill}</span>
                    <span className="text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", skill.color)} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
