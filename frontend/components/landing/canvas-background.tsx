"use client"

import { useEffect, useRef } from "react"

// ─── Particle types ───────────────────────────────────────────────
interface Particle {
  hX: number; hY: number; hZ: number
  aX: number; aY: number; aZ: number
  gX: number; gY: number; gZ: number
  x: number; y: number; z: number
  size: number
  color: string
  brightness: number
  phase: number
}

// ─── House wireframe segments [x1,y1,z1, x2,y2,z2] ───────────────
const HOUSE_SEGS = [
  [-120, 90,-120,  120, 90,-120],
  [ 120, 90,-120,  120, 90, 120],
  [ 120, 90, 120, -120, 90, 120],
  [-120, 90, 120, -120, 90,-120],
  [-120, 90,-120, -120,-40,-120],
  [ 120, 90,-120,  120,-40,-120],
  [ 120, 90, 120,  120,-40, 120],
  [-120, 90, 120, -120,-40, 120],
  [-120,-40,-120,  120,-40,-120],
  [ 120,-40,-120,  120,-40, 120],
  [ 120,-40, 120, -120,-40, 120],
  [-120,-40, 120, -120,-40,-120],
  [-120,-40,-120,    0,-130,-120],
  [ 120,-40,-120,    0,-130,-120],
  [-120,-40, 120,    0,-130, 120],
  [ 120,-40, 120,    0,-130, 120],
  [   0,-130,-120,   0,-130, 120],
]

function buildParticles(count: number): Particle[] {
  const COLORS = [
    "rgba(212,163,115,",  // warm gold
    "rgba(212,163,115,",
    "rgba(224,186,140,",  // pale amber
    "rgba(148,163,184,",  // slate
    "rgba(186,230,253,",  // ice
  ]

  return Array.from({ length: count }, (_, i) => {
    const seg = HOUSE_SEGS[i % HOUSE_SEGS.length]
    const t   = Math.random()
    const j   = () => (Math.random() - 0.5) * 8
    const hX  = seg[0] + (seg[3] - seg[0]) * t + j()
    const hY  = seg[1] + (seg[4] - seg[1]) * t + j()
    const hZ  = seg[2] + (seg[5] - seg[2]) * t + j()

    const u  = (Math.random() - 0.5) * Math.PI
    const aX = Math.sin(u) * 150
    const aY = -Math.cos(u) * 100 + 20
    const aZ = (Math.random() - 0.5) * 250

    const R   = 160
    const phi = Math.acos(1 - 2 * (i / count))
    const th  = Math.PI * (1 + Math.sqrt(5)) * i
    const gX  = Math.sin(phi) * Math.cos(th) * R
    const gY  = Math.sin(phi) * Math.sin(th) * R
    const gZ  = Math.cos(phi) * R

    return {
      hX, hY, hZ, aX, aY, aZ, gX, gY, gZ,
      x: hX, y: hY, z: hZ,
      size:       Math.random() * 1.8 + 0.5,
      color:      COLORS[Math.floor(Math.random() * COLORS.length)],
      brightness: Math.random() * 0.4 + 0.6,
      phase:      Math.random() * Math.PI * 2,
    }
  })
}

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollProgressRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return
      scrollProgressRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 150
      mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 150
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const PARTICLES = buildParticles(2000)

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let rotY = 0
    let time = 0

    const tick = () => {
      time += 0.013
      rotY += 0.0017

      const m = mouseRef.current
      m.x += (m.tx - m.x) * 0.055
      m.y += (m.ty - m.y) * 0.055

      const W = canvas.width / (window.devicePixelRatio || 1)
      const H = canvas.height / (window.devicePixelRatio || 1)
      
      // Center the particle animation globally
      const cx = W * 0.5
      const cy = H * 0.5

      ctx.clearRect(0, 0, W, H)

      const p = scrollProgressRef.current
      const t1 = Math.min(p / 0.5, 1)
      const t2 = Math.max((p - 0.5) / 0.5, 0)

      const FOV = 440
      const projected = []

      for (const q of PARTICLES) {
        let tx = q.hX + (q.aX - q.hX) * t1
        let ty = q.hY + (q.aY - q.hY) * t1
        let tz = q.hZ + (q.aZ - q.hZ) * t1
        if (t2 > 0) {
          tx += (q.gX - tx) * t2
          ty += (q.gY - ty) * t2
          tz += (q.gZ - tz) * t2
        }

        const baseWave = Math.sin(time * 1.4 + q.phase) * 2.8
        const archRipple = Math.sin(time * 2.2 + tx * 0.03) * 11 * Math.sin(t1 * Math.PI)
        const globePulse = t2 > 0 ? 1 + Math.sin(time * 1.9 + q.phase) * 0.038 * t2 : 1

        tx = (tx + baseWave * (1 - t1)) * globePulse
        ty = (ty + baseWave * (1 - t1) + archRipple) * globePulse
        tz = (tz + baseWave * (1 - t1)) * globePulse

        q.x += (tx - q.x) * 0.075
        q.y += (ty - q.y) * 0.075
        q.z += (tz - q.z) * 0.075

        const cosY = Math.cos(rotY + m.x * 0.0042)
        const sinY = Math.sin(rotY + m.x * 0.0042)
        const rx = q.x * cosY - q.z * sinY
        const rz = q.x * sinY + q.z * cosY

        const cosX = Math.cos(m.y * 0.0042)
        const sinX = Math.sin(m.y * 0.0042)
        const ry = q.y * cosX - rz * sinX
        const rz2 = q.y * sinX + rz * cosX

        const scale = FOV / (FOV + rz2)
        projected.push({
          x: rx * scale + cx,
          y: ry * scale + cy,
          z: rz2,
          r: q.size * scale,
          color: q.color,
          a: scale * q.brightness * (Math.sin(time * 2.8 + q.phase) * 0.16 + 0.84)
        })
      }

      projected.sort((a, b) => b.z - a.z)

      for (const d of projected) {
        if (d.x < 0 || d.x > W || d.y < 0 || d.y > H) continue
        ctx.fillStyle = d.color + Math.min(Math.max(d.a, 0), 1) + ")"
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#090d16]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
