"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Loader2, Check, MapPin, Phone, Mail, Calendar } from "lucide-react"

export default function HomeownerProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+92 300 1234567",
    address: "Street 5, Phase 6, DHA",
    city: "Lahore",
    state: "Punjab",
    zipCode: "54000",
    bio: "Homeowner looking for quality contractors for various renovation projects in Lahore.",
  })

  useEffect(() => {
    setMounted(true)
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        const userId = user.id || user.UserID
        
        if (userId) {
          fetch(`/api/proxy?path=${encodeURIComponent(`/api/users/${userId}`)}`)
            .then(res => res.json())
            .then(data => {
              if (data && !data.error) {
                const names = (data.FullName || "").split(" ")
                setFormData({
                  firstName: names[0] || "",
                  lastName: names.slice(1).join(" ") || "",
                  email: data.Email || "",
                  phone: data.Phone || "",
                  address: data.Address || "",
                  city: data.City || "",
                  state: data.State || "",
                  zipCode: data.ZipCode || "",
                  bio: data.Bio || "",
                })
              }
            })
            .catch(err => console.error("Error fetching profile:", err))
        }
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
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
            bio: formData.bio,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            avatar: null // Handle avatar later
          })
        })
        
        if (res.ok) {
          // Update LocalStorage so the Header/Sidebar update too
          const updatedUser = {
            ...user,
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email
          }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setSaveSuccess(true)
          setTimeout(() => setSaveSuccess(false), 3000)
        }
      } catch (err) {
        console.error("Error saving profile:", err)
      }
    }
    
    setIsLoading(false)
  }

  const getInitials = () => {
    if (!formData.firstName) return "U"
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
  }

  // Instead of return null, we show a loading state to prevent the "blank page" error
  if (!mounted) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold">
              {getInitials()}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-card-foreground">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-muted-foreground">Homeowner</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h3 className="text-lg font-semibold text-card-foreground">Personal Information</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                className="h-11" 
                placeholder="First Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                className="h-11" 
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="h-11 pl-10" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  className="h-11 pl-10" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About</Label>
            <Textarea 
              id="bio" 
              value={formData.bio} 
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
              className="min-h-[100px] resize-none" 
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h3 className="text-lg font-semibold text-card-foreground">Address</h3>
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="h-11" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className="h-11" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 items-center">
          {saveSuccess && <span className="text-green-500 text-sm animate-in fade-in">Saved!</span>}
          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Saving...</> : <><Check className="mr-2 w-4 h-4" />Save Changes</>}
          </Button>
        </div>
      </form>
    </div>
  )
}