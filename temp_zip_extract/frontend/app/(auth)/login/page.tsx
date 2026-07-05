"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { AuthService } from "@/services/authService"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loggedInUser, setLoggedInUser] = useState<any>(null)

  // Check if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Session check failed", e)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const userData = await AuthService.login(formData.email, formData.password)
      
      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData))
      }

      const userRole = (userData.Role || userData.role || '').toLowerCase()
      if (userRole === 'admin') window.location.href = '/admin/dashboard'
      else if (userRole === 'worker') window.location.href = '/worker/dashboard' 
      else window.location.href = '/homeowner/dashboard' 
    } catch (error: any) {
        console.error('Error:', error)
        alert('Login Failed: ' + (error.message || 'Could not reach the server.'))
        setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* Decorative Left Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <Image
          src="/login-bg.webp"
          alt="Luxury Architecture"
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-110"
          priority
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAQCdASoIAAgAAkA4JQBOiP+AAsf9vAAK8oXlR0vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/wAA"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/20 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 p-16 max-w-2xl animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Elevating the Standard of <span className="text-primary-foreground italic">Renovation</span>.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Experience a seamless connection between visionary homeowners and elite craftsmen. 
            Your dream project starts with a single secure login.
          </p>
        </div>
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Login Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-grid-black dark:bg-grid-white">
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Wrench className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Reno<span className="text-primary">Connect</span>
            </span>
          </Link>

          {loggedInUser ? (
            <div className="space-y-8 glass p-8 rounded-3xl border border-primary/20 shadow-2xl animate-fade-in text-center mt-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <Wrench className="w-8 h-8 text-primary animate-pulse" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">Already Signed In</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  You are active as <span className="font-semibold text-foreground">{loggedInUser.fullName || loggedInUser.FullName || loggedInUser.email}</span> ({loggedInUser.userRole || loggedInUser.Role || 'User'}).
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    const role = (loggedInUser.Role || loggedInUser.role || 'homeowner').toLowerCase()
                    window.location.href = `/${role}/dashboard`
                  }}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    await AuthService.logout()
                    setLoggedInUser(null)
                  }}
                  className="w-full h-12 text-base font-semibold rounded-xl border-border/50 hover:bg-muted/50 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300"
                >
                  Sign Out & Use Another Account
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Access Your Portal</h2>
                <p className="text-muted-foreground text-lg">
                  Welcome back to the platform.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 bg-background/50 border-border/50 focus:ring-primary/20 rounded-xl px-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="password" className="text-sm font-semibold">Security Credential</Label>
                    <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      Reset Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-12 bg-background/50 border-border/50 focus:ring-primary/20 rounded-xl px-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <Checkbox
                    id="remember"
                    className="rounded-md w-5 h-5 border-border/50 data-[state=checked]:bg-primary"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
                    Maintain session on this device
                  </Label>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all hover:translate-y-[-2px] active:translate-y-[0px]" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  New to the platform?{" "}
                  <Link href="/register" className="text-primary font-bold hover:text-primary/80 transition-colors ml-1">
                    Establish an Account
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}