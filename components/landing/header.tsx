"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wrench } from "lucide-react"

const navLinks = [
  { href: "/projects", label: "Portfolio" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#services", label: "Services" },
  { href: "/#testimonials", label: "Testimonials" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    // Check for user session
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    
    const id = href.includes("#") ? href.split("#")[1] : ""
    if (!id) return

    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const targetPosition = elementPosition - offset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 800
      let start: number | null = null

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const run = ease(timeElapsed, startPosition, distance, duration)
        window.scrollTo(0, run)
        if (timeElapsed < duration) requestAnimationFrame(animation)
      }

      const ease = (t: number, b: number, c: number, d: number) => {
        t /= d / 2
        if (t < 1) return (c / 2) * t * t + b
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
      }

      requestAnimationFrame(animation)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <header
      className={`fixed top-2 lg:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-7xl rounded-full ${
        isScrolled
          ? "bg-background/60 backdrop-blur-xl border border-border/50 shadow-[0_8px_32px_0_oklch(0_0_0/0.05)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary/20">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Renovation<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isInternal = link.href.includes("#")
              const isHomePage = mounted && window.location.pathname === "/"
              
              if (isInternal && isHomePage) {
                return (
                  <a
                    key={link.href}
                    href={link.href.replace("/", "")} // use #how-it-works instead of /#how-it-works
                    onClick={(e) => handleScrollClick(e, link.href)}
                    className="text-sm font-semibold text-muted-foreground/80 hover:text-primary transition-all duration-300 relative group/link"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/link:w-full" />
                  </a>
                )
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  className="text-sm font-semibold text-muted-foreground/80 hover:text-primary transition-all duration-300 relative group/link"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/link:w-full" />
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {mounted && user ? (
              <Button asChild className="text-sm font-semibold rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <Link href={`/${(user.Role || user.role || 'homeowner').toLowerCase()}/dashboard`}>Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-sm font-semibold hover:bg-primary/5 rounded-full px-6">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="text-sm font-semibold rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isInternal = link.href.includes("#")
                const isHomePage = mounted && window.location.pathname === "/"
                
                if (isInternal && isHomePage) {
                  return (
                    <a
                      key={link.href}
                      href={link.href.replace("/", "")}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      onClick={(e) => handleScrollClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    scroll={false}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="flex flex-col gap-2 mt-4 px-4">
                {mounted && user ? (
                  <Button asChild className="w-full">
                    <Link href={`/${(user.Role || user.role || 'homeowner').toLowerCase()}/dashboard`}>Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
