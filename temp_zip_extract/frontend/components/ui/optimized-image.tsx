"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: "square" | "video" | "portrait" | "wide"
  priority?: boolean
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  aspectRatio = "video",
  priority = false 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  const ratioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]"
  }

  return (
    <div className={cn(
      "relative overflow-hidden bg-muted transition-all duration-500",
      ratioClass[aspectRatio],
      className
    )}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          "object-cover transition-all duration-700",
          isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0"
        )}
        onLoadingComplete={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
