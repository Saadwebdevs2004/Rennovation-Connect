"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  title: string
  description: string
  category: string
}

export function BeforeAfterSlider({ beforeImage, afterImage, title, description, category }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = Math.max(0.1, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }, [])

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault()
    }
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    handleMove(clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: true })
    window.addEventListener("mouseup", handleGlobalMouseUp)
    window.addEventListener("touchend", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("touchmove", handleGlobalTouchMove)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
      window.removeEventListener("touchend", handleGlobalMouseUp)
    }
  }, [isDragging, handleMove])

  return (
    <div className="space-y-6 group">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">{category}</p>
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs text-right leading-relaxed italic">
          "{description}"
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative aspect-[16/10] rounded-[32px] overflow-hidden cursor-ew-resize select-none border border-border/50 shadow-2xl touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* After Image (Base) */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image 
            src={afterImage} 
            alt="After" 
            fill
            className="object-cover pointer-events-none select-none"
            draggable="false"
          />
          <div className="absolute bottom-6 right-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-10 select-none">
            After
          </div>
        </div>

        {/* Before Image (Overlay) */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden z-20 pointer-events-none select-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-y-0 left-0 pointer-events-none select-none" style={{ width: `${(1 / (sliderPosition / 100)) * 100}%` }}>
            <Image 
              src={beforeImage} 
              alt="Before" 
              fill
              className="object-cover pointer-events-none select-none"
              priority
              draggable="false"
            />
          </div>
          <div className="absolute bottom-6 left-6 bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-30 select-none">
            Before
          </div>
        </div>

        {/* Sleek Glowing Laser Divider (NO laggy CSS transitions) */}
        <div 
          className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-white/20 via-white to-white/20 cursor-ew-resize z-30 shadow-[0_0_10px_rgba(255,255,255,0.9)]"
          style={{ left: `${sliderPosition}%` }}
        />

        {/* Slider Handle (NO laggy CSS transitions) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize z-40 select-none pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Glassmorphic floating Before/After Pill Badge */}
          <div className="px-3.5 py-2 bg-white dark:bg-card rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-primary/20 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary transition-transform group-hover:scale-105">
            <span>Before</span>
            <svg className="w-3.5 h-3.5 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
            <span>After</span>
          </div>
        </div>
      </div>
    </div>
  )
}
