"use client"

import { useState, useRef, useEffect } from "react"
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

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = Math.max(0.1, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

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
        className="relative aspect-[16/10] rounded-[32px] overflow-hidden cursor-ew-resize select-none border border-border/50 shadow-2xl"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* After Image (Base) */}
        <div className="absolute inset-0">
          <Image 
            src={afterImage} 
            alt="After" 
            fill
            className="object-cover"
          />
          <div className="absolute bottom-6 right-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-10">
            After
          </div>
        </div>

        {/* Before Image (Overlay) */}
        <div 
          className="absolute inset-y-0 left-0 border-r-2 border-white overflow-hidden z-20"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-y-0 left-0" style={{ width: `${(1 / (sliderPosition / 100)) * 100}%` }}>
            <Image 
              src={beforeImage} 
              alt="Before" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute bottom-6 left-6 bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-30">
            Before
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute inset-y-0 w-1 bg-white cursor-ew-resize group-hover:scale-x-150 transition-transform"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse animation-delay-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
