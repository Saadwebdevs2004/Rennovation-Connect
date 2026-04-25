import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-20 px-8",
      "rounded-[2rem] border-2 border-dashed border-border/50 bg-muted/5",
      "animate-fade-in",
      className
    )}>
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 shadow-inner">
        <Icon className="w-9 h-9 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-black text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground font-medium max-w-xs leading-relaxed mb-8">{description}</p>
      {ctaLabel && ctaHref && (
        <Button size="lg" className="rounded-2xl px-10 font-bold shadow-lg shadow-primary/20" asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  )
}
