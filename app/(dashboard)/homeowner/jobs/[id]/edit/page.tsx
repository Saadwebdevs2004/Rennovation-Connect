"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { ArrowLeft, Loader2, Save, X } from "lucide-react"

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

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    budgetMin: "",
    budgetMax: "",
  })

  // Fetch current job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}`)}`)
        const data = await response.json()
        
        if (response.ok) {
          setFormData({
            title: data.title || "",
            category: data.category || "",
            description: data.description || "",
            location: data.location || "",
            budgetMin: data.budgetMin?.toString() || "",
            budgetMax: data.budgetMax?.toString() || "",
          })
        } else {
          alert("Job not found!")
          router.push("/homeowner/jobs")
        }
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) fetchJob()
  }, [jobId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const min = parseInt(formData.budgetMin)
      const max = parseInt(formData.budgetMax)

      setFormError(null)

      if (min > max) {
        setFormError("Minimum budget cannot be higher than maximum budget.")
        setIsSaving(false)
        return
      }

      // Ensure numeric values for the backend
      const payload = {
        ...formData,
        budgetMin: min,
        budgetMax: max
      }

      console.log("Sending update payload:", payload)

      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert("Job updated successfully! ✨")
        router.push(`/homeowner/jobs/${jobId}`)
        router.refresh()
      } else {
        const data = await response.json()
        alert("Server Error: " + (data.error || "Could not update job"))
      }
    } catch (error) {
      console.error('Fetch Error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background mesh-gradient relative -m-4 lg:-m-6 p-4 lg:p-6 overflow-hidden">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.5_0.18_250/0.03),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10 animate-fade-in">
        {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Edit Job Details</h1>
        <p className="text-muted-foreground mt-1">
          Update the information for your project
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-card-foreground">Basic Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[150px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="h-11"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-card-foreground">Budget</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Minimum Budget (Rs)</Label>
              <Input
                id="budgetMin"
                type="number"
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
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                required
                className="h-11"
              />
            </div>
          </div>
          {formError && (
            <p className="text-sm font-medium text-destructive mt-2">{formError}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} className="min-w-[150px]">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
      </div>
    </div>
  )
}

