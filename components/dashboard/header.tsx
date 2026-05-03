"use client"

import { useState, useEffect } from "react" // Added useEffect
import { useRouter } from "next/navigation" // Added for logout
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { removeUserCookie } from "@/lib/auth-cookies"
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
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  FileText,
  CreditCard,
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

export function DashboardHeader({ role, user: propUser, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState({ id: null, name: "User", email: "" })
  const [notifications, setNotifications] = useState<any[]>([])
  const [randomGreeting, setRandomGreeting] = useState("Hello")
  const [randomSubGreeting, setRandomSubGreeting] = useState("Welcome back")

  // 1. Handle Hydration and LocalStorage
  useEffect(() => {
    setMounted(true)
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    
    // Set Dynamic Greetings
    const hour = new Date().getHours();
    let gPool = ["Hello"];
    let sPool = ["Your command center is active"];
    
    if (hour >= 5 && hour < 8) {
      gPool = ["Early Bird", "Rise and Shine", "Good Morning", "Morning Glow"];
      sPool = ["The early professional gets the job", "Coffee is ready, let's work", "Morning inspiration has arrived"];
    } else if (hour >= 8 && hour < 12) {
      gPool = ["Good Morning", "Happy Morning", "Great start", "Top of the morning"];
      sPool = ["Let's make today productive", "Ready for a breakthrough day?", "Your morning agenda is waiting"];
    } else if (hour >= 12 && hour < 17) {
      gPool = ["Good Afternoon", "Productive Afternoon", "Hello", "Mid-day check-in"];
      sPool = ["Making great progress today", "The afternoon hustle is on", "Keep up the momentum"];
    } else if (hour >= 17 && hour < 21) {
      gPool = ["Good Evening", "Happy Evening", "Welcome back", "Evening session"];
      sPool = ["Wrapping up a great day?", "The evening shift is live", "Time to reflect and plan"];
    } else if (hour >= 21 || hour < 1) {
      gPool = ["Good Night", "Quiet Evening", "Still working?", "Late session"];
      sPool = ["Your nocturnal workspace is ready", "Burning the midnight oil?", "Peaceful productivity"];
    } else {
      gPool = ["Late Night Vibes", "Night Owl", "Working late?", "Deep work mode"];
      sPool = ["Focus is highest at this hour", "The world sleeps, you build", "Quiet hours command center"];
    }
    
    setRandomGreeting(gPool[Math.floor(Math.random() * gPool.length)]);
    setRandomSubGreeting(sPool[Math.floor(Math.random() * sPool.length)]);

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        const userId = parsed.id || parsed.UserID
        if (!userId) return;

        // Set initial data immediately
        setCurrentUser({
          id: userId,
          name: parsed.fullName || parsed.name || "User",
          email: parsed.email || ""
        })
        
        const timestamp = new Date().getTime();
        
        // Parallel Data Fetching for speed
        const loadDashboardData = async () => {
          try {
            const [userRes, notifyRes] = await Promise.all([
              fetch(`/api/proxy?path=${encodeURIComponent(`/api/users/${userId}`)}`),
              fetch(`/api/proxy?path=${encodeURIComponent(`/api/notifications/${userId}`)}`, { 
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
              })
            ]);

            // Handle User Sync
            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData && !userData.error) {
                setCurrentUser(prev => ({
                  ...prev,
                  name: userData.FullName || userData.fullName || prev.name,
                  email: userData.Email || userData.email || prev.email
                }));
                localStorage.setItem('user', JSON.stringify({ ...parsed, fullName: userData.FullName, email: userData.Email }));
              }
            }

            // Handle Notifications
            if (notifyRes.ok) {
              const notifyData = await notifyRes.json();
              if (Array.isArray(notifyData)) {
                setNotifications(notifyData.map(n => ({
                  id: n.id,
                  type: n.type,
                  title: n.title,
                  description: n.description,
                  time: new Date(n.created_at).toLocaleDateString(),
                  read: n.is_read
                })));
              }
            }
          } catch (err) {
            console.error("Dashboard Data Load Error:", err);
          }
        };

        loadDashboardData();
      } catch (e) {
        console.error("Storage Parse Error:", e);
      }
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    if (currentUser.id) {
      fetch(`/api/proxy?path=${encodeURIComponent(`/api/notifications/user/${currentUser.id}/read-all`)}`, { 
        method: 'PUT',
        cache: 'no-store'
      })
        .then(() => {
          setNotifications(notifications.map(n => ({ ...n, read: true })))
        })
        .catch(err => console.error("Failed to mark notifications as read:", err))
    }
  }

  // 2. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user') // CLEAR SESSION STORAGE AS WELL
    removeUserCookie() // CLEAR SECURE COOKIE AS WELL
    setNotifications([]) // CLEAR NOTIFICATIONS STATE IMMEDIATELY
    setCurrentUser({ id: null, name: "User", email: "" })
    window.location.href = '/login' // Force a full navigation to ensure clean state
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bid": return FileText
      case "message": return MessageSquare
      case "payment": return CreditCard
      default: return Bell
    }
  }

  // Prevent flash of wrong data
  const displayName = mounted ? currentUser.name : "Loading..."
  const displayEmail = mounted ? currentUser.email : "..."

  return (
    <header className="sticky top-0 z-30 h-20 glass border-b border-border/50 shadow-[0_4px_24px_oklch(0_0_0/0.02)]">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* Left Side - Dynamic Greeting */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {randomGreeting}, <span className="text-gradient font-black">{displayName.split(' ')[0]}</span>
            </h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">
              {randomSubGreeting}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary"
                    onClick={handleMarkAllRead}
                  >
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    return (
                      <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          notification.read ? "bg-muted" : "bg-primary/10"
                        }`}>
                          <Icon className={`w-4 h-4 ${notification.read ? "text-muted-foreground" : "text-primary"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
            </Button>
          )}

          {/* User Menu - UPDATED WITH DYNAMIC DATA */}
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {propUser?.avatar ? (
                      <img src={propUser.avatar} alt={displayName} className="w-8 h-8 object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-foreground">{displayName}</p>
                    <p className="text-[10px] text-primary uppercase font-black tracking-widest leading-none mt-0.5">{role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground font-normal">{displayEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${role}/profile`} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${role}/settings`} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive cursor-pointer"
                  onSelect={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Loading...</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}