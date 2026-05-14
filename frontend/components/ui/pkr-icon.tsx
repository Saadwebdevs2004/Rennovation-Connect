// components/ui/pkr-icon.tsx
// A custom PKR (Pakistani Rupee) icon styled to match lucide-react icon props.
// Use this as a drop-in replacement for DollarSign across the entire platform.

import { cn } from "@/lib/utils"

interface PkrIconProps {
  className?: string
}

export function PkrIcon({ className }: PkrIconProps) {
  return (
    <span
      aria-label="Pakistani Rupee"
      className={cn(
        "inline-flex items-center justify-center font-black leading-none select-none",
        className
      )}
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      ₨
    </span>
  )
}
