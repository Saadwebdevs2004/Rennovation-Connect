"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShieldAlert, CheckCircle } from "lucide-react"

export default function WorkerReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = () => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      if (userId) {
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/reviews/worker/${userId}`)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setReviews(data)
            }
            setLoading(false)
          })
          .catch(err => {
            console.error("Failed to fetch reviews:", err)
            setLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDispute = async (reviewId: number) => {
    if (!confirm("Are you sure you want to dispute this review? Admin will review your claim.")) return;

    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/reviews/${reviewId}/dispute`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        fetchReviews();
        alert("Review has been disputed and is now under admin investigation.");
      }
    } catch (error) {
      console.error("Failed to dispute review:", error);
      alert("An error occurred. Please try again.");
    }
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Reviews</h1>
        <p className="text-muted-foreground mt-1">Manage feedback from your completed jobs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/50 md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Rating Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="text-5xl font-bold text-foreground">{averageRating}</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-6 h-6 ${parseFloat(averageRating) >= star ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center bg-card rounded-xl border border-border flex flex-col items-center">
              <Star className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Reviews Yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Complete more jobs to start receiving feedback from homeowners.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className={`border-border/50 transition-colors ${review.is_disputed ? 'bg-destructive/5 border-destructive/20' : ''}`}>
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{review.job_title}</CardTitle>
                    <CardDescription>Reviewed by {review.reviewer_name} • {new Date(review.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  {review.is_disputed ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Under Admin Review
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${review.rating >= star ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    "{review.comment}"
                  </p>
                  
                  {!review.is_disputed && (
                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                        onClick={() => handleDispute(review.id)}
                      >
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Dispute Fake Review
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
