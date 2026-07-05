"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

// ─── Particle Types ───────────────────────────────────────────────
interface Particle {
  hX: number; hY: number; hZ: number; // House Blueprint (Slide 0)
  aX: number; aY: number; aZ: number; // Arch Vault (Slide 1)
  gX: number; gY: number; gZ: number; // Globe Network (Slide 2)
  x: number; y: number; z: number;    // Current rendered pos
  size: number;
  alpha: number;
  id: number;
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const particlesRef = useRef<Particle[]>([])

  // Init particles
  useEffect(() => {
    const P_COUNT = 500;
    const p: Particle[] = [];
    
    for (let i = 0; i < P_COUNT; i++) {
      // 1) House Blueprint (Wireframe)
      let hX = 0, hY = 0, hZ = 0;
      const part = Math.random();
      if (part < 0.3) {
        // Base box
        hX = (Math.random() - 0.5) * 400;
        hY = (Math.random() - 0.5) * 200 + 100;
        hZ = (Math.random() - 0.5) * 400;
      } else if (part < 0.7) {
        // Roof
        hX = (Math.random() - 0.5) * 450;
        hY = -Math.random() * 200;
        hZ = (Math.random() - 0.5) * 450;
      } else {
        // Pillars / details
        hX = (Math.random() > 0.5 ? 200 : -200);
        hY = (Math.random() - 0.5) * 300;
        hZ = (Math.random() - 0.5) * 400;
      }

      // 2) Arch Vault (Cylinder/Curve)
      const angleA = Math.random() * Math.PI;
      const radiusA = 250 + Math.random() * 50;
      const aX = Math.cos(angleA) * radiusA;
      const aY = -Math.sin(angleA) * radiusA + 100;
      const aZ = (Math.random() - 0.5) * 600;

      // 3) Globe Network
      const phi = Math.acos(-1 + (2 * i) / P_COUNT);
      const theta = Math.sqrt(P_COUNT * Math.PI) * phi;
      const radiusG = 220 + Math.random() * 20;
      const gX = radiusG * Math.cos(theta) * Math.sin(phi);
      const gY = radiusG * Math.sin(theta) * Math.sin(phi);
      const gZ = radiusG * Math.cos(phi);

      p.push({
        hX, hY, hZ,
        aX, aY, aZ,
        gX, gY, gZ,
        x: hX, y: hY, z: hZ,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        id: i
      });
    }
    particlesRef.current = p;
  }, []);

  // Track Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = rect.height - window.innerHeight;
      
      // Calculate progress from 0 to 1 inside the 300vh container
      let progress = -rect.top / scrollHeight;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);
      
      const particles = particlesRef.current;
      const progress = scrollProgress;
      
      // Center of the particle object
      const cx = width > 768 ? width * 0.75 : width * 0.5;
      const cy = height * 0.5;
      const fov = 400;

      // Rotation based on time and scroll
      const rotY = time * 0.5 + progress * Math.PI * 2;
      const rotX = Math.sin(time * 0.2) * 0.2 + (progress - 0.5) * 0.5;

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      particles.forEach((p) => {
        // Interpolate target positions based on scroll
        let targetX = p.hX;
        let targetY = p.hY;
        let targetZ = p.hZ;

        if (progress < 0.5) {
          // Slide 0 -> Slide 1 (House to Arch)
          const t = progress * 2; // 0 to 1
          // Ease in out
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          targetX = p.hX + (p.aX - p.hX) * ease;
          targetY = p.hY + (p.aY - p.hY) * ease;
          targetZ = p.hZ + (p.aZ - p.hZ) * ease;
        } else {
          // Slide 1 -> Slide 2 (Arch to Globe)
          const t = (progress - 0.5) * 2; // 0 to 1
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          targetX = p.aX + (p.gX - p.aX) * ease;
          targetY = p.aY + (p.gY - p.aY) * ease;
          targetZ = p.aZ + (p.gZ - p.aZ) * ease;
        }

        // Apply 3D rotation
        let x1 = targetX * cosY - targetZ * sinY;
        let z1 = targetZ * cosY + targetX * sinY;
        
        let y2 = targetY * cosX - z1 * sinX;
        let z2 = z1 * cosX + targetY * sinX;

        // Add gentle breathing effect
        const breath = Math.sin(time * 2 + p.id * 0.01) * 5;
        z2 += breath;

        // Project to 2D
        const scale = fov / (fov + z2 + 500); // push back a bit
        const x2d = cx + x1 * scale;
        const y2d = cy + y2 * scale;

        // Draw particle
        if (scale > 0 && x2d > 0 && x2d < width && y2d > 0 && y2d < height) {
          // Color logic based on depth and progress
          const depthAlpha = Math.min(1, Math.max(0.1, scale * 1.5));
          const baseAlpha = p.alpha * depthAlpha;
          
          // Interpolate color based on progress
          // 0: Gold/Accent (#d4a373), 1: White/Silver
          ctx.beginPath();
          ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
          
          if (progress < 0.5) {
             ctx.fillStyle = `rgba(212, 163, 115, ${baseAlpha})`; // Gold
          } else {
             ctx.fillStyle = `rgba(148, 163, 184, ${baseAlpha})`; // Slate
          }
          
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress]);

  // Helper for text slide opacity
  // slide 0: active from 0 to 0.33
  // slide 1: active from 0.33 to 0.66
  // slide 2: active from 0.66 to 1.0
  const getSlideOpacity = (index: number) => {
    const center = index * 0.5; // 0, 0.5, 1
    const distance = Math.abs(scrollProgress - center);
    // distance 0 -> opacity 1
    // distance > 0.2 -> opacity 0
    let op = 1 - (distance * 5);
    return Math.max(0, Math.min(1, op));
  };

  const getSlideTransform = (index: number) => {
    const center = index * 0.5;
    const distance = scrollProgress - center;
    // distance negative -> slide coming from bottom (Y > 0)
    // distance positive -> slide going up (Y < 0)
    const y = distance * 200; 
    return `translateY(${y}px)`;
  };

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#090d16] text-white">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Particle Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Content Wrapper */}
        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 z-10">
          
          {/* Slide 0: Digital Blueprint */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 max-w-[600px] w-full"
            style={{ 
              opacity: getSlideOpacity(0), 
              transform: getSlideTransform(0),
              pointerEvents: getSlideOpacity(0) > 0.5 ? 'auto' : 'none'
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#d4a373] shrink-0" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d4a373]">
                  Digital Blueprint
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight font-heading">
                Structuring Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a373] to-[#f8e0c0]">
                  Dream Architecture.
                </span>
              </h2>
              <p className="text-lg text-slate-300/90 leading-relaxed max-w-md">
                Connect with premium, verified builders. Post your project, receive competitive bids, and track every milestone.
              </p>
              <div className="pt-4">
                <Button size="lg" className="bg-[#d4a373] text-[#090d16] hover:bg-[#d4a373]/90 rounded-full px-8 h-12 font-bold text-base transition-all" asChild>
                  <Link href="/register">Start Your Project <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Slide 1: Structural Vault */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 max-w-[600px] w-full"
            style={{ 
              opacity: getSlideOpacity(1), 
              transform: getSlideTransform(1),
              pointerEvents: getSlideOpacity(1) > 0.5 ? 'auto' : 'none'
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-slate-400 shrink-0" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">
                  Structural Integrity
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight font-heading">
                Verified Experts. <br />
                <span className="text-white">Flawless Execution.</span>
              </h2>
              <p className="text-lg text-slate-300/90 leading-relaxed max-w-md">
                Every tradesperson in our network undergoes a rigorous vetting process. Your property deserves nothing less than mastery.
              </p>
              <div className="pt-4 flex gap-4">
                <Button size="lg" className="bg-white text-[#090d16] hover:bg-white/90 rounded-full px-8 h-12 font-bold text-base transition-all" asChild>
                  <Link href="/projects">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Slide 2: Global Network */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 max-w-[600px] w-full"
            style={{ 
              opacity: getSlideOpacity(2), 
              transform: getSlideTransform(2),
              pointerEvents: getSlideOpacity(2) > 0.5 ? 'auto' : 'none'
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#d4a373] shrink-0" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d4a373]">
                  Global Network
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight font-heading">
                Join The <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a373] to-white">
                  Gold Standard.
                </span>
              </h2>
              <p className="text-lg text-slate-300/90 leading-relaxed max-w-md">
                Experience the future of property renovation. Secure payments, transparent milestones, and unparalleled craftsmanship.
              </p>
              <div className="pt-4">
                <Button size="lg" className="bg-[#d4a373] text-[#090d16] hover:bg-[#d4a373]/90 rounded-full px-8 h-12 font-bold text-base transition-all" asChild>
                  <Link href="/register">Join Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Progress Indicators */}
        <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          {[0, 1, 2].map((i) => {
            const isActive = Math.abs(scrollProgress - i * 0.5) < 0.25;
            return (
              <div 
                key={i}
                className={`w-1.5 rounded-full transition-all duration-500 ${isActive ? 'h-8 bg-[#d4a373]' : 'h-2 bg-white/20'}`}
              />
            )
          })}
        </div>

        {/* Scroll Hint (Fades out when scrolling begins) */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-20 transition-opacity duration-500"
          style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
