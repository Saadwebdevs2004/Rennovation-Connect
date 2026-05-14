"use client"

import { PkrIcon } from "@/components/ui/pkr-icon"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CreditCard, 
  History, 
  Plus, 
  ShieldCheck,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Lock
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function HomeownerPaymentsPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(String(user.id || user.UserID || ""))
    }
  }, [])

  const { data: payments, isValidating } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/payments/homeowner/${userId}`)}` : null,
    fetcher
  )

  const totalSpent = Array.isArray(payments) ? payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0) : 0

  if (!userId && !payments) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Financial Center</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Secure project funding and history
          </p>
        </div>
        <Button className="h-14 rounded-2xl px-8 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-transform hover:scale-105">
          <Plus className="mr-2 w-5 h-5" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Payment Methods */}
          <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden group">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-black">Active Wallets</CardTitle>
              <CardDescription className="font-medium">Securely managed credit and debit cards</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="flex items-center justify-between p-6 rounded-3xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-10 bg-white rounded-lg border border-border flex items-center justify-center shadow-sm">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-foreground tracking-tight">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Expires 12/28</p>
                  </div>
                </div>
                <Button variant="ghost" className="font-bold text-primary hover:bg-transparent">Edit</Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-border/50">
              <div>
                <CardTitle className="text-xl font-black">Project Transactions</CardTitle>
                <CardDescription className="font-medium">Every rupee accounted for and verified</CardDescription>
              </div>
              {isValidating ? <Loader2 className="w-5 h-5 animate-spin text-primary opacity-50" /> : <History className="w-6 h-6 text-primary" />}
            </CardHeader>
            <CardContent className="p-0">
              {Array.isArray(payments) && payments.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {payments.map((payment: any) => (
                    <div key={payment.id} className="p-6 hover:bg-muted/30 transition-all flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-success/5 border border-success/10 flex items-center justify-center text-success shadow-inner">
                          <PkrIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-foreground text-lg leading-tight">{payment.job_title || 'Project Funding'}</p>
                          <p className="text-sm text-muted-foreground font-medium mt-1">{new Date(payment.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-foreground tracking-tight">RS {payment.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-success uppercase font-black tracking-widest mt-1">Confirmed</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center text-muted-foreground space-y-4">
                  <PkrIcon className="w-12 h-12 mx-auto opacity-10" />
                  <p className="font-bold text-lg">No project transactions found yet</p>
                  <Button variant="outline" className="rounded-xl font-bold">Start Your First Project</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary text-white rounded-[2.5rem] border-none shadow-[0_30px_60px_-15px_oklch(0.5_0.18_250_/_0.3)] overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110 duration-700">
               <ShieldCheck className="w-32 h-32 rotate-12" />
             </div>
             <CardHeader className="p-8">
               <CardTitle className="text-2xl font-black">Escrow Protect</CardTitle>
               <CardDescription className="text-white/70 font-medium leading-relaxed">
                 Your funds are held safely and only released when you approve the work.
               </CardDescription>
             </CardHeader>
             <CardContent className="p-8 pt-0">
               <Button variant="secondary" className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-white text-primary hover:bg-white/90">
                 Read Safety Policy
                 <ChevronRight className="ml-2 w-4 h-4" />
               </Button>
             </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black">Funding Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
               <div className="flex justify-between items-center pb-4 border-b border-border/50">
                 <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Investment</span>
                 <span className="font-black text-2xl text-foreground">
                   RS {totalSpent.toLocaleString()}
                 </span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b border-border/50">
                 <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Projects Funded</span>
                 <span className="font-black text-xl text-primary">{payments?.length || 0}</span>
               </div>
               <div className="pt-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 text-center">
                 Updated in Real-Time via RenoConnect API
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
