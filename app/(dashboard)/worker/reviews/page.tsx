"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Star, 
  ShieldAlert, 
  CheckCircle, 
  MessageSquare, 
  TrendingUp, 
  ThumbsUp,
  Gavel,
  History,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function WorkerReviewsPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(String(user.id || user.UserID || ""))
    }
  }, [])

  const { data: reviews, mutate, isValidating } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/reviews/worker/${userId}`)}` : null,
    fetcher
  )

  const handleDispute = async (reviewId: number) => {
    if (!confirm("Are you sure you want to dispute this review? Admin will review your claim.")) return;

    try {
      const response = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/reviews/${reviewId}/dispute`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Failed to dispute review:", error);
    }
  }

  const averageRating = Array.isArray(reviews) && reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: Array.isArray(reviews) ? reviews.filter((r: any) => Math.floor(r.rating) === star).length : 0
  }))

  if (!userId && !reviews) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-[2.5rem]" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Reputation Engine</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            Your verified performance history
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-2xl border border-border/50">
           <div className="px-4 py-2 bg-background rounded-xl border border-border shadow-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="font-black text-lg">{averageRating}</span>
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-3">Avg Rating</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="space-y-8">
          {/* Rating Summary Card */}
          <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black">Scorecard</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="flex flex-col items-center justify-center py-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <div className="text-6xl font-black text-foreground tracking-tighter">{averageRating}</div>
                <div className="flex gap-1.5 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${parseFloat(averageRating) >= star ? 'text-warning fill-warning' : 'text-muted/20'}`} 
                    />
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4 opacity-60">
                  {reviews?.length || 0} Professional Reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-4">
                {ratingCounts.map(({ star, count }) => {
                  const percentage = Array.isArray(reviews) && reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-4 group">
                      <div className="flex items-center gap-1 w-6 shrink-0">
                        <span className="text-xs font-black">{star}</span>
                        <Star className="w-2.5 h-2.5 text-warning fill-warning" />
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden border border-border/10">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 group-hover:bg-accent" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pro Insight Card */}
          <Card className="rounded-[2.5rem] border-none bg-foreground text-background p-8 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <TrendingUp className="w-40 h-40" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
                 <ThumbsUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black leading-tight">Elite Status</h3>
              <p className="text-xs font-medium text-background/60 leading-relaxed">
                Workers with a rating above 4.8 appear in the "Recommended" section for new projects.
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full" />
                Latest Feedback
             </h2>
             <History className="w-5 h-5 text-muted-foreground opacity-40" />
          </div>

          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review: any) => (
              <Card 
                key={review.id} 
                className={cn(
                  "rounded-[2.5rem] border-border/50 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-xl",
                  review.is_disputed && "bg-destructive/[0.02] border-destructive/20"
                )}
              >
                <CardHeader className="p-8 pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-widest bg-muted border-none">
                           {review.job_title}
                        </Badge>
                        {review.is_disputed && (
                          <Badge variant="destructive" className="rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Investigation Active
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-black pt-2">{review.job_title}</CardTitle>
                      <p className="text-xs text-muted-foreground font-medium">
                        By <span className="text-foreground font-bold">{review.reviewer_name}</span> • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 p-2 bg-muted/40 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${review.rating >= star ? 'text-warning fill-warning' : 'text-muted/20'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <p className="text-foreground/80 text-base leading-relaxed font-medium italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="pt-6 border-t border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                       <CheckCircle className="w-4 h-4 text-success" />
                       Verified Project feedback
                    </div>
                    
                    {!review.is_disputed && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 text-[10px] font-black uppercase tracking-widest h-10 px-4"
                        onClick={() => handleDispute(review.id)}
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Appeal Feedback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 px-10 rounded-[3rem] border-4 border-dashed border-border/20 bg-muted/5">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8 shadow-inner">
                <Star className="w-12 h-12 text-muted/20" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Your Legacy Starts Here</h3>
              <p className="text-muted-foreground font-medium max-w-sm mb-10 leading-relaxed">
                Complete your active projects to earn your first verified review and climb the leaderboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
