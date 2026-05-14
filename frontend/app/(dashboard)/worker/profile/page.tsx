"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Camera,
  Star,
  Shield,
  Award,
  MapPin,
  Clock,
  Plus,
  X,
  Save,
  CheckCircle2,
  Briefcase,
  FileText,
  Loader2,
} from "lucide-react"

const services = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "HVAC",
  "Painting",
  "Roofing",
  "Flooring",
  "General Contracting",
]

const certifications = [
  { name: "Licensed Plumber", issuer: "PEC / Skill Council", year: "2018", verified: true },
  { name: "Master Plumber", issuer: "National Association", year: "2020", verified: true },
  { name: "Electrician Certification", issuer: "PITB Certified", year: "2019", verified: false },
]

export default function WorkerProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    city: "",
    state: "",
    zipCode: "",
    avatar: ""
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
                  bio: data.Bio || "",
                  city: data.City || "",
                  state: data.State || "",
                  zipCode: data.ZipCode || "",
                  avatar: data.Avatar || ""
                })
              }
            })
            .catch(err => console.error("Error fetching worker profile:", err))
        }
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
            avatar: formData.avatar
          })
        })
        
        if (res.ok) {
          const updatedUser = {
            ...user,
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email
          }
          const isSession = !!sessionStorage.getItem('user')
          const isLocal = !!localStorage.getItem('user')
          if (isSession && !isLocal) {
            sessionStorage.setItem('user', JSON.stringify(updatedUser))
          } else {
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
          setSaveSuccess(true)
          setTimeout(() => setSaveSuccess(false), 3000)
        }
      } catch (err) {
        console.error("Error saving worker profile:", err)
      }
    }
    
    setIsLoading(false)
  }

  const [selectedServices, setSelectedServices] = useState(["Plumbing", "HVAC"])
  const [isAvailable, setIsAvailable] = useState(true)
  const [hourlyRate, setHourlyRate] = useState("75")
  const [travelRadius, setTravelRadius] = useState("25")

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your professional profile and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && <span className="text-green-500 text-sm animate-fade-in">Saved!</span>}
          <Button onClick={() => handleSave()} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {formData.firstName && formData.lastName 
                    ? `${formData.firstName[0]}${formData.lastName[0]}` 
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-muted-foreground">{formData.bio.split('.')[0] || "Professional Worker"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  4.9 (127 reviews)
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3 text-success" />
                  Verified Pro
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Award className="h-3 w-3 text-primary" />
                  Top Rated
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {formData.city && formData.state ? `${formData.city}, ${formData.state}` : "Location not set"}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  234 jobs completed
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Member since 2020
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Availability</p>
                <p className={`font-semibold ${isAvailable ? "text-success" : "text-muted-foreground"}`}>
                  {isAvailable ? "Available" : "Not Available"}
                </p>
              </div>
              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  This will be displayed on your public profile
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
              <CardDescription>Select the services you provide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Badge
                    key={service}
                    variant={selectedServices.includes(service) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedServices.includes(service)
                        ? "bg-primary hover:bg-primary/90"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleService(service)}
                  >
                    {selectedServices.includes(service) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Pricing & Availability</CardTitle>
              <CardDescription>Set your rates and work preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (RS)</Label>
                  <div className="relative">
                    <PkrIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Your base hourly rate</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelRadius">Travel Radius (miles)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="travelRadius"
                      type="number"
                      value={travelRadius}
                      onChange={(e) => setTravelRadius(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Maximum distance you'll travel for jobs</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Working Hours</Label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select defaultValue="8am">
                    <SelectTrigger>
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6am">6:00 AM</SelectItem>
                      <SelectItem value="7am">7:00 AM</SelectItem>
                      <SelectItem value="8am">8:00 AM</SelectItem>
                      <SelectItem value="9am">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="6pm">
                    <SelectTrigger>
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4pm">4:00 PM</SelectItem>
                      <SelectItem value="5pm">5:00 PM</SelectItem>
                      <SelectItem value="6pm">6:00 PM</SelectItem>
                      <SelectItem value="7pm">7:00 PM</SelectItem>
                      <SelectItem value="8pm">8:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Emergency Services</p>
                  <p className="text-sm text-muted-foreground">Available for after-hours emergencies</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Licenses & Certifications</CardTitle>
                  <CardDescription>Add your professional credentials</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credential
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{cert.name}</h4>
                          {cert.verified && (
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle2 className="h-3 w-3 text-success" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • Issued {cert.year}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Insurance & Bonding</CardTitle>
              <CardDescription>Your insurance information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance">Liability Insurance Provider</Label>
                  <Input id="insurance" defaultValue="ABC Insurance Co." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input id="policyNumber" defaultValue="PLB-123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverage">Coverage Amount</Label>
                  <Input id="coverage" defaultValue="RS 1,000,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration Date</Label>
                  <Input id="expiry" type="date" defaultValue="2025-06-30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "New Job Matches", description: "Get notified when new jobs match your services" },
                { label: "Bid Updates", description: "Updates on your submitted bids" },
                { label: "Messages", description: "New messages from clients" },
                { label: "Payment Received", description: "Notifications when payments are processed" },
                { label: "Marketing Emails", description: "Tips and promotional content" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={index < 4} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Change Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
