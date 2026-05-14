import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-2xl p-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden", 
      className
    )}>
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
             <h3 className="text-3xl font-bold text-foreground tracking-tight">{value}</h3>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              {description}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-3 text-xs font-bold px-2 py-1 rounded-lg w-fit",
              trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className="opacity-70 font-medium">this week</span>
            </div>
          )}
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  )
}
