"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Wrench, Twitter, Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const footerLinks = {
// ... same as before
  platform: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Services", href: "/#services" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Portfolio", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

export function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#") && window.location.pathname === "/") {
      e.preventDefault()
      const id = href.split("#")[1]
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
  }

  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-28">
        <div className="grid lg:grid-cols-6 gap-16 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-sidebar-primary/20">
                <Wrench className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Renovation<span className="text-sidebar-primary">Connect</span>
              </span>
            </Link>
            <p className="text-sidebar-foreground/60 leading-relaxed max-w-xs">
              Empowering homeowners and tradespeople with world-class tools. 
              Built for quality, trust, and exceptional craftsmanship.
            </p>

            {/* Newsletter */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-sidebar-foreground/40">Subscribe</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-sidebar-accent border-sidebar-border rounded-full px-5 text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus-visible:ring-sidebar-primary"
                />
                <Button size="icon" className="shrink-0 rounded-full bg-sidebar-primary hover:bg-sidebar-primary/90 shadow-lg shadow-sidebar-primary/20">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:col-span-4 gap-8 lg:gap-8">
            <div>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-sidebar-foreground/40">Platform</h3>
              <ul className="space-y-4">
                {footerLinks.platform.map((link) => {
                  const isInternal = link.href.includes("#")
                  const isHomePage = mounted && window.location.pathname === "/"
                  
                  if (isInternal && isHomePage) {
                    return (
                      <li key={link.label}>
                        <a 
                          href={link.href.replace("/", "")} 
                          onClick={(e) => handleScrollClick(e, link.href)}
                          className="text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-primary transition-all duration-300 cursor-pointer"
                        >
                          {link.label}
                        </a>
                      </li>
                    )
                  }

                  return (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-primary transition-all duration-300">
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-sidebar-foreground/40">Company</h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-primary transition-all duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-sidebar-foreground/40">Resources</h3>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-primary transition-all duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-sidebar-foreground/40">Legal</h3>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-primary transition-all duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-sidebar-foreground/40">
            © {new Date().getFullYear()} Renovation Connect. Designed with excellence.
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-primary hover:border-sidebar-primary/50 transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
