"use client"

import { PkrIcon } from "@/components/ui/pkr-icon"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Building2,
  Eye,
  Wallet,
  Plus
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function WorkerEarningsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'))
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserId(String(user.id || user.UserID || ""))
    }
  }, [])

  // SWR for Transactions
  const { data: rawTransactions, mutate: mutateTransactions, isValidating: isTransactionsValidating } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/payments/worker/${userId}`)}` : null,
    fetcher
  )

  // SWR for Pending Approvals
  const { data: pendingApprovals, mutate: mutatePending } = useSWR(
    userId ? `/api/proxy?path=${encodeURIComponent(`/api/payments/pending/${userId}`)}` : null,
    fetcher
  )

  const transactions = Array.isArray(rawTransactions) ? rawTransactions.map((t: any) => ({
    id: t.id,
    job: t.job_title || "Unknown Job",
    client: t.homeowner_name || "Homeowner",
    amount: t.amount || 0,
    status: t.status || "processing",
    date: new Date(t.created_at).toLocaleDateString(),
    rawDate: new Date(t.created_at),
    paymentMethod: t.method === 'manual' ? 'Bank Transfer' : 'Credit Card',
    receipt_image_url: t.receipt_image_url || null,
  })) : []

  const totalEarnings = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
  const completedEarnings = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
  const pendingEarnings = transactions
    .filter((t) => t.status !== "completed")
    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)

  const avgJobValue = transactions.length > 0 ? Math.round(totalEarnings / transactions.length) : 0

  const handleApprovePayment = async (paymentId: number) => {
    try {
      const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/${paymentId}/approve`)}`, {
        method: 'PUT'
      });
      if (res.ok) {
        mutateTransactions();
        mutatePending();
      }
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  }

  // Monthly Chart Logic (Fast)
  const generateMonthlyEarnings = () => {
    const months: { month: string, year: number, monthNum: number, amount: number }[] = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({ month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), monthNum: d.getMonth(), amount: 0 });
    }
    transactions.forEach(t => {
      if (t.status === 'completed' && t.rawDate) {
        const targetMonth = months.find(m => m.monthNum === t.rawDate.getMonth() && m.year === t.rawDate.getFullYear());
        if (targetMonth) targetMonth.amount += parseFloat(t.amount || 0);
      }
    });
    return months;
  };

  const monthlyEarnings = generateMonthlyEarnings();
  const maxMonthlyEarning = Math.max(...monthlyEarnings.map(m => m.amount), 1);

  if (!userId && !rawTransactions) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Earnings Console</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Managing your professional revenue
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-44 h-12 rounded-2xl shadow-sm border-border/50">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="all-time">All Time History</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 rounded-2xl border-border/50 font-bold px-6">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="p-7 space-y-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PkrIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Balance</p>
              <p className="text-3xl font-black text-foreground">RS {totalEarnings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm">
          <CardContent className="p-7 space-y-4">
            <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Withdrawn</p>
              <p className="text-3xl font-black text-foreground">RS {completedEarnings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm">
          <CardContent className="p-7 space-y-4">
            <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">In Escrow</p>
              <p className="text-3xl font-black text-foreground">RS {pendingEarnings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm">
          <CardContent className="p-7 space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Avg. Per Job</p>
              <p className="text-3xl font-black text-foreground">RS {avgJobValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black">Revenue Timeline</CardTitle>
            <CardDescription className="font-medium">Earnings trend over the last 6 cycles</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-64 flex items-end gap-3">
              {monthlyEarnings.map((month) => {
                const heightPercent = Math.max((month.amount / maxMonthlyEarning) * 100, 4);
                return (
                  <div key={`${month.month}-${month.year}`} className="flex-1 flex flex-col items-center justify-end h-full gap-3 group">
                    <div className="relative w-full flex items-end justify-center h-full">
                      <div 
                        className="w-full max-w-[48px] bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-2xl border border-primary/10" 
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                          RS {month.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{month.month}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/50 shadow-sm">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black">Payment Details</CardTitle>
            <CardDescription className="font-medium">Verified payout accounts</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 flex items-center gap-5">
              <div className="w-14 h-10 bg-background rounded-lg border border-border flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground text-sm sm:text-base">Standard Bank</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">•••• 4242</p>
              </div>
              <Badge className="bg-success text-white border-none text-[9px] sm:text-[10px] uppercase font-black tracking-widest px-2 sm:px-3">Active</Badge>
            </div>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest border-dashed border-2 hover:border-primary hover:text-primary transition-all">
              <Plus className="mr-2 w-4 h-4" /> Connect Bank Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="rounded-[2.5rem] border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-border/50">
          <div>
            <CardTitle className="text-xl font-black">History (Recent Transactions)</CardTitle>
            <CardDescription className="font-medium">Every payment tracked and verified</CardDescription>
          </div>
          {isTransactionsValidating && <Loader2 className="w-5 h-5 animate-spin text-primary opacity-50" />}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <div key={t.id} className="p-6 hover:bg-muted/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10 shadow-inner">
                      <PkrIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black text-foreground text-lg leading-tight">{t.job}</h4>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Client: {t.client} • {t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <Badge variant="outline" className={cn(
                        "rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] border-none",
                        t.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning-foreground"
                      )}>
                        {t.status === 'pending_approval' ? 'Waiting for You' : t.status}
                      </Badge>
                      <div className="text-left md:text-right">
                        <p className="text-xl font-black text-foreground tracking-tight">RS {t.amount.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{t.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       {t.status === 'pending_approval' && (
                         <Button 
                           size="sm" 
                           onClick={() => handleApprovePayment(t.id)}
                           className="bg-success hover:bg-success/90 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-4 shadow-lg shadow-success/20"
                         >
                           Verify & Accept
                         </Button>
                       )}
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => setSelectedReceipt(t.receipt_image_url || "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d")}
                         className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-4"
                       >
                         <Eye className="w-4 h-4 mr-2" />
                         View Proof
                       </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-muted-foreground space-y-3">
                <CreditCard className="w-12 h-12 mx-auto opacity-10" />
                <p className="font-bold text-lg">No revenue history yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-foreground text-background">
            <DialogTitle className="text-2xl font-black tracking-tight">Payment Verification Proof</DialogTitle>
            <DialogDescription className="text-background/60 font-medium">
              Verify the details of this transfer before accepting the revenue.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 bg-background flex flex-col items-center">
             <div className="w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-muted">
                {selectedReceipt && (
                  <img 
                    src={selectedReceipt} 
                    alt="Payment Receipt" 
                    className="w-full h-auto object-contain max-h-[60vh]"
                  />
                )}
             </div>
             <Button 
                className="w-full mt-8 h-16 rounded-2xl font-black uppercase tracking-widest text-sm"
                onClick={() => setSelectedReceipt(null)}
             >
                Close Preview
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
