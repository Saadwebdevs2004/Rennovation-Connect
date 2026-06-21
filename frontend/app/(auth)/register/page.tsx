"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wrench, Eye, EyeOff, ArrowRight, Loader2, Home, HardHat, Check, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthService } from "@/services/authService"

type UserRole = "homeowner" | "worker"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get("role") as UserRole) || "homeowner"
  
  const [role, setRole] = useState<UserRole>(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await AuthService.register(fullName, formData.email, formData.password, role)
      alert('Account created successfully!');
      router.push("/login");
    } catch (error: any) {
      console.error('Error:', error);
      alert('Registration Failed: ' + (error.message || 'Check your fields'));
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* Decorative Left Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <Image
          src="/register-bg.webp"
          alt="Professional Craftsmanship"
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-110"
          priority
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAQCdASoIAAgAAkA4JQBOiP+AAsf9vAAK8oXlR0vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/vSj/wAA"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/40 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 p-16 max-w-2xl animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Join the Elite Network of <span className="text-primary-foreground italic">Renovation</span> Pros.
          </h1>
          
          <div className="space-y-6 mt-12">
             {[
               "Access to high-budget premium projects",
               "Verified identity and secure escrow payments",
               "Direct communication with visionary clients",
               "Real-time project milestone tracking"
             ].map((benefit, i) => (
               <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                 <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                    <Check className="w-3 h-3 text-white" />
                 </div>
                 <span className="text-white/90 text-lg font-medium tracking-wide">{benefit}</span>
               </div>
             ))}
          </div>
        </div>
        
        {/* Floating Accent */}
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Registration Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 relative bg-grid-black dark:bg-grid-white overflow-y-auto">
        <div className="w-full max-w-lg relative z-10 animate-fade-in py-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Wrench className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Reno<span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Create Your Account</h2>
            <p className="text-muted-foreground text-lg">
              Select your path and join the community.
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              type="button"
              onClick={() => setRole("homeowner")}
              className={cn(
                "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden",
                role === "homeowner" 
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]" 
                  : "border-border/50 hover:border-primary/30 bg-background/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors",
                role === "homeowner" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
              )}>
                <Home className="w-6 h-6" />
              </div>
              <p className="font-bold text-foreground text-lg">Homeowner</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Hire expert pros</p>
              {role === "homeowner" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole("worker")}
              className={cn(
                "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden",
                role === "worker" 
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]" 
                  : "border-border/50 hover:border-primary/30 bg-background/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors",
                role === "worker" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
              )}>
                <HardHat className="w-6 h-6" />
              </div>
              <p className="font-bold text-foreground text-lg">Professional</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Find elite projects</p>
              {role === "worker" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  required 
                  className="h-12 bg-background/50 border-border/50 focus:ring-primary/20 rounded-xl px-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  required 
                  className="h-12 bg-background/50 border-border/50 focus:ring-primary/20 rounded-xl px-4"
                />
              </div>
            </div>

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
              <Label htmlFor="password" className="text-sm font-semibold">Secure Password</Label>
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
              <p className="text-[10px] text-muted-foreground mt-1 px-1">
                Must be at least 8 characters with letters and numbers.
              </p>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all hover:translate-y-[-2px] active:translate-y-[0px] mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Establish My Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Already a member?{" "}
              <Link href="/login" className="text-primary font-bold hover:text-primary/80 transition-colors ml-1">
                Access your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}