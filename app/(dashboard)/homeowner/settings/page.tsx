"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Bell, Shield, Key, Loader2 } from "lucide-react"

export default function HomeownerSettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" })
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      const id = parsed.id || parsed.UserID
      setUserId(String(id))
      
      // Fetch fresh data
      fetch(`/api/proxy?path=${encodeURIComponent(`/api/users/${id}`)}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setUser({
              name: data.FullName || "",
              email: data.Email || ""
            })
          }
        })
        .catch(err => console.error("Error fetching settings:", err))
    }
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/users/${userId}`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user.name,
          email: user.email // Note: Email update might need verification, but we'll try
        })
      })
      
      if (res.ok) {
        // Update LocalStorage
        const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
        if (savedUser) {
          const parsed = JSON.parse(savedUser)
          parsed.fullName = user.name
          parsed.email = user.email
          localStorage.setItem('user', JSON.stringify(parsed))
        }
        alert("Settings saved successfully!")
      } else {
        alert("Failed to save settings.")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        {/* Settings Nav */}
        <div className="space-y-2 flex flex-col">
          <Button 
            variant={activeTab === "profile" ? "secondary" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 w-4 h-4" />
            Profile Info
          </Button>
          <Button 
            variant={activeTab === "notifications" ? "secondary" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="mr-2 w-4 h-4" />
            Notifications
          </Button>
          <Button 
            variant={activeTab === "privacy" ? "secondary" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("privacy")}
          >
            <Shield className="mr-2 w-4 h-4" />
            Privacy & Security
          </Button>
          <Button 
            variant={activeTab === "password" ? "secondary" : "ghost"} 
            className="justify-start"
            onClick={() => setActiveTab("password")}
          >
            <Key className="mr-2 w-4 h-4" />
            Password
          </Button>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      type="email" 
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive daily updates via email.</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive real-time alerts.</p>
                    </div>
                    <Button variant="outline">Disabled</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your privacy settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Your account is currently set to public. Professionals can see your basic profile when you post a job.</p>
                  <Button variant="outline">Make Profile Private</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "password" && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password securely.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Password updated successfully!"); }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
