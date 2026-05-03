"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Phone, MapPin, Camera, Loader2, Save } from "lucide-react"

export default function AdminProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: ""
  })

  useEffect(() => {
    setMounted(true)
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      // Fetch latest from DB
      fetch(`/api/proxy?path=${encodeURIComponent(`/api/users/${userId}`)}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            const names = data.FullName ? data.FullName.split(" ") : ["Admin", "User"]
            setFormData({
              firstName: names[0] || "",
              lastName: names.slice(1).join(" ") || "",
              email: data.Email || "",
              phone: data.Phone || "",
              address: data.Address || "",
              bio: data.Bio || "System Administrator for Renovation Connect platform."
            })
          }
          setIsLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch admin profile:", err)
          setIsLoading(false)
        })
    }
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      try {
        const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/users/${userId}`)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address,
            bio: formData.bio
          })
        })
        
        if (res.ok) {
           alert("Profile updated successfully!")
        }
      } catch (err) {
        console.error("Save failed:", err)
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your administrative account details</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1">
          <Shield className="w-4 h-4 mr-2" />
          Full Access Admin
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Sidebar */}
        <Card className="md:col-span-1 border-border/50">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="relative mx-auto w-32 h-32">
              <div className="w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-16 h-16 text-primary" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-background border border-border rounded-xl shadow-lg hover:bg-muted transition-colors">
                <Camera className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg">{formData.firstName} {formData.lastName}</h3>
              <p className="text-sm text-muted-foreground">Platform Administrator</p>
            </div>
            <div className="pt-4 border-t border-border/50 space-y-2">
               <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                 <Mail className="w-4 h-4" />
                 {formData.email}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your public profile and contact info</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={formData.email} disabled className="bg-muted/50 cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    className="pl-10" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="address" 
                    className="pl-10" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Administrative Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
