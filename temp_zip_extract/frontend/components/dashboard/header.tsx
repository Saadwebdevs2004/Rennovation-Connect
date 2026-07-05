"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { removeUserCookie } from "@/lib/auth-cookies"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Menu,
  User as UserIcon,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  FileText,
  CreditCard,
  Sparkles,
  Check,
} from "lucide-react"
import { UserRole } from "./sidebar"

interface HeaderProps {
  role: UserRole
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onMenuClick?: () => void
}

const GREETINGS = {
  homeowner: [
    "Ready to transform another space?",
    "Another renovation idea today?",
    "Back to planning the perfect home?",
    "The dream home project continues.",
    "Another step toward the perfect renovation.",
    "Planning changes for the space again?",
    "Looks like renovation mode is active."
  ],
  worker: [
    "Another project lined up?",
    "Ready to review incoming jobs?",
    "Looks like the work queue is growing.",
    "Another busy contractor session?",
    "Project discussions are active today.",
    "Blueprints are waiting for your touch.",
    "Another day of building excellence."
  ]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function DashboardHeader({ role, user: propUser, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState("")

  // Get user from local storage for initial key
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    return parsed.id || parsed.UserID;
  }

  const userId = getUserId();

  // Optimized Fetching with SWR
  const { data: userData } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/users/${userId}`)}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const { data: notifications, mutate: mutateNotifications } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/notifications/${userId}`)}` : null,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  )

  useEffect(() => {
    setMounted(true)
    
    // Pick a random role-based greeting
    const roleGreetings = role === 'worker' ? GREETINGS.worker : GREETINGS.homeowner
    const randomGreeting = roleGreetings[Math.floor(Math.random() * roleGreetings.length)]
    setGreeting(randomGreeting)
  }, [role])

  const handleLogout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    removeUserCookie()
    window.location.href = '/login'
  }
  
  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`/api/proxy?path=${encodeURIComponent(`/api/notifications/${id}/read`)}`, {
        method: 'PUT'
      })
      mutateNotifications()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) return
    try {
      await fetch(`/api/proxy?path=${encodeURIComponent(`/api/notifications/user/${userId}/read-all`)}`, {
        method: 'PUT'
      })
      mutateNotifications()
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.is_read).length : 0
  const displayName = userData?.FullName || userData?.fullName || propUser?.name || "User"
  const displayEmail = userData?.Email || userData?.email || propUser?.email || ""

  // Prevent Radix ID Mismatches by not rendering ID-dependent components until mount
  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 h-20 glass border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:flex flex-col space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-32 h-10 rounded-xl" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 h-20 glass border-b border-border/50 shadow-sm">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex flex-col">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="text-primary font-black opacity-90">{greeting}</span>
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-background">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-border/50">
              <div className="p-4 bg-primary/5 border-b border-border/50 flex items-center justify-between">
                <span className="font-bold">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={handleMarkAllAsRead}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark all as read
                    </Button>
                  )}
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{unreadCount} New</Badge>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <DropdownMenuItem 
                      key={n.id} 
                      className="p-4 border-b border-border/10 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors focus:bg-muted/50"
                      onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                          <Bell className={`w-4 h-4 ${n.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          <p className={`text-sm leading-tight ${n.is_read ? 'text-muted-foreground' : 'font-bold text-foreground'}`}>{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{n.description}</p>
                          <p className="text-[10px] font-medium text-muted-foreground/60">{new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-muted/30 mx-auto" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-2xl hover:bg-primary/5 transition-all">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shadow-inner">
                  {propUser?.avatar ? (
                    <img src={propUser.avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-foreground leading-none mb-1">{displayName}</p>
                  <p className="text-[10px] text-primary uppercase font-black tracking-widest opacity-70">{role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block opacity-40" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-border/50">
              <DropdownMenuLabel className="p-3">
                <p className="font-bold text-base">{displayName}</p>
                <p className="text-xs text-muted-foreground font-medium">{displayEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                <Link href={`/${role}/profile`}>
                  <UserIcon className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-medium">My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                <Link href={`/${role}/settings`}>
                  <Settings className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-medium">Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem 
                className="rounded-xl p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="font-bold">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}