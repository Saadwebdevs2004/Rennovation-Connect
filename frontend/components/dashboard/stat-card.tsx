import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ComponentType } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: ComponentType<any>
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-7 border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden group", 
      className
    )}>
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a373]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          
          {description && (
            <p className="text-sm text-slate-500 flex items-center gap-2 pt-1 font-medium">
              <span className="w-1 h-1 rounded-full bg-[#d4a373]" />
              {description}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 mt-3 text-xs font-semibold px-2.5 py-1 rounded-full w-fit",
              trend.isPositive 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-red-50 text-red-600"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className="opacity-70 font-medium">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#d4a373] group-hover:bg-[#d4a373]/5 transition-colors duration-500">
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
