"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X, Loader2, CheckCircle } from "lucide-react"

const categories = [
  { value: "plumbing", label: "Plumbing", icon: "🔧" },
  { value: "electrical", label: "Electrical", icon: "⚡" },
  { value: "carpentry", label: "Carpentry", icon: "🪚" },
  { value: "painting", label: "Painting", icon: "🎨" },
  { value: "roofing", label: "Roofing", icon: "🏠" },
  { value: "hvac", label: "HVAC", icon: "❄️" },
  { value: "bathroom", label: "Bathroom Renovation", icon: "🚿" },
  { value: "kitchen", label: "Kitchen Renovation", icon: "🍳" },
  { value: "general", label: "General Contracting", icon: "🏗️" },
]

const urgencyOptions = [
  { value: "flexible", label: "Flexible - No rush" },
  { value: "within_month", label: "Within a month" },
  { value: "within_week", label: "Within a week" },
  { value: "urgent", label: "Urgent - ASAP" },
]

export default function PostJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    budgetMin: "",
    budgetMax: "",
    urgency: "",
  })

  // Grab the homeowner's ID from memory as soon as the page loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userObj = JSON.parse(storedUser)
      setUserId(userObj.id || userObj.UserID || userObj.userId)
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).map(f => f.name)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileName))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!userId) {
      alert("Error: We can't find your user ID. Please log in again.")
      setIsLoading(false)
      return
    }

    try {
      const min = parseInt(formData.budgetMin)
      const max = parseInt(formData.budgetMax)

      if (min > max) {
        alert("Oops! Your minimum budget (RS " + min + ") cannot be higher than your maximum budget (RS " + max + "). Please fix this before posting.")
        setIsLoading(false)
        return
      }

      // Package the data to send to Node.js
      const payload = {
        homeownerId: userId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        budgetMin: min,
        budgetMax: max,
        urgency: formData.urgency
      }

      // Send the POST request to your backend API
      const response = await fetch('/api/proxy?path=%2Fapi%2Fjobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        alert("Job posted successfully! 🎉")
        router.push("/homeowner/jobs") // Teleport back to the My Jobs page
      } else {
        alert("Error posting job: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Could not connect to the server. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/homeowner/jobs">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Jobs
          </Link>
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Post a New Job</h1>
        <p className="text-muted-foreground mt-1">
          Describe your project to receive bids from qualified professionals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-card-foreground">Basic Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., Kitchen Renovation, Bathroom Plumbing Repair"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project in detail. Include specific requirements, materials needed, and any other relevant information..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Detailed descriptions help professionals provide accurate bids
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State or ZIP code"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="h-11"
            />
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-card-foreground">Budget & Timeline</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Minimum Budget (Rs)</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="1000"
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Maximum Budget (Rs)</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="5000"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Timeline</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="When do you need this done?" />
              </SelectTrigger>
              <SelectContent>
                {urgencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Photos (Visual Only for Now) */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-card-foreground">Photos (Optional)</h2>
          <p className="text-sm text-muted-foreground -mt-4">
            Add photos of the work area to help professionals understand the scope
          </p>
          
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="photos"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="photos" className="cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB each
              </p>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
                >
                  <span className="truncate max-w-[150px]">{file}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/homeowner/jobs">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 w-4 h-4" />
                Post Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}