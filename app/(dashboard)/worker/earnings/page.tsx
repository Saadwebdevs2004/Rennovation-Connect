"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

export default function WorkerEarningsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Chart placeholder since we aren't tracking full historical data yet
  const monthlyEarnings = [
    { month: "Oct", amount: 0 },
    { month: "Nov", amount: 0 },
    { month: "Dec", amount: 0 },
    { month: "Jan", amount: 0 },
    { month: "Feb", amount: 0 },
    { month: "Mar", amount: 0 },
  ]

  const fetchEarningsData = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      if (userId) {
        // Fetch all transactions
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/worker/${userId}`)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setTransactions(data.map((t: any) => ({
                id: t.id,
                job: t.job_title || "Unknown Job",
                client: t.homeowner_name || "Homeowner",
                amount: t.amount || 0,
                status: t.status || "processing",
                date: new Date(t.created_at).toLocaleDateString(),
                paymentMethod: t.method === 'manual' ? 'Bank Transfer' : 'Credit Card',
              })))
            }
            setLoading(false)
          })
          .catch(err => {
            console.error("Failed to fetch payments:", err)
            setLoading(false)
          })

        // Fetch pending manual approvals
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/pending/${userId}`)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setPendingApprovals(data);
            }
          })
          .catch(err => console.error("Failed to fetch pending approvals:", err));
      }
    }
  }

  useEffect(() => {
    fetchEarningsData()
  }, [])

  const handleApprovePayment = async (paymentId: number) => {
    try {
      const res = await fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/${paymentId}/approve`)}`, {
        method: 'PUT'
      });
      if (res.ok) {
        // Refresh data
        fetchEarningsData();
      }
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  }

  const totalEarnings = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
  const completedEarnings = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
  const pendingEarnings = transactions
    .filter((t) => t.status !== "completed")
    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)

  const avgJobValue = transactions.length > 0 ? Math.round(totalEarnings / transactions.length) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your income and payments</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-foreground mt-1">RS {totalEarnings.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span>Based on all transactions</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <PkrIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground mt-1">RS {completedEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {transactions.filter((t) => t.status === "completed").length} jobs paid
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground mt-1">RS {pendingEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {transactions.filter((t) => t.status !== "completed").length} payments processing
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Job Value</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  RS {avgJobValue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Per accepted job</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your earnings tracking will populate here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {monthlyEarnings.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative">
                    <div className="w-full bg-primary/10 rounded-t-lg" style={{ height: `10px` }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{month.month}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Historical chart data will become available as you complete more jobs over time.</p>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Your connected accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Standard Bank</p>
                  <p className="text-sm text-muted-foreground">Connected to Account</p>
                </div>
                <Badge variant="secondary" className="text-success">Primary</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <Card className="border-warning/50 shadow-md">
          <CardHeader className="bg-warning/5">
            <CardTitle className="text-warning-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Manual Transfers Pending Approval
            </CardTitle>
            <CardDescription>Homeowners have uploaded receipts for these jobs. Please verify the funds are in your account before approving.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pendingApprovals.map((payment) => (
                <div key={payment.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{payment.job_title}</h4>
                    <p className="text-sm text-muted-foreground">Client: {payment.homeowner_name}</p>
                    <p className="text-sm text-muted-foreground">Amount: RS {payment.amount}</p>
                  </div>
                  <Button onClick={() => handleApprovePayment(payment.id)} className="shrink-0 bg-success hover:bg-success/90 text-success-foreground">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve Payment
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No transactions found.</p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <PkrIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.job}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.client} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={
                        transaction.status === "completed"
                          ? "bg-success/10 text-success border-success/20"
                          : transaction.status === "pending"
                          ? "bg-warning/10 text-warning-foreground border-warning/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {transaction.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {transaction.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold text-foreground">RS {transaction.amount}</p>
                      <p className="text-xs text-muted-foreground">{transaction.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
