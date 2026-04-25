"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Loader2 } from "lucide-react"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState({ totalRevenue: 0, pendingPayouts: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payRes, statRes] = await Promise.all([
          fetch('/api/proxy?path=/api/payments'),
          fetch('/api/proxy?path=/api/stats/admin')
        ])
        
        // Safety check for Payments
        const payType = payRes.headers.get("content-type")
        if (payRes.ok && payType && payType.includes("application/json")) {
          const payData = await payRes.json()
          if (Array.isArray(payData)) setPayments(payData)
        }

        // Safety check for Stats
        const statType = statRes.headers.get("content-type")
        if (statRes.ok && statType && statType.includes("application/json")) {
          const statData = await statRes.json()
          if (!statData.error) setStats(statData)
        }
      } catch (err) {
        console.error("Failed to fetch payment data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Financial Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor all platform transactions and payouts</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">RS {stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <TrendingUpIcon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Platform Fees (10%)</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">RS {(stats.totalRevenue * 0.1).toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <PkrIcon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Recent Transactions</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{payments.length}</h3>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg text-warning">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A complete list of all payments on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : payments.length > 0 ? (
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>From (Homeowner)</TableHead>
                    <TableHead>To (Worker)</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.job_title}</TableCell>
                      <TableCell>{p.homeowner_name}</TableCell>
                      <TableCell>{p.worker_name}</TableCell>
                      <TableCell className="font-bold text-foreground">RS {p.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'completed' ? 'success' : 'secondary'} className="capitalize">
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(p.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                <PkrIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No transactions found for the current period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TrendingUpIcon(props: any) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
