"use client"
import { PkrIcon } from "@/components/ui/pkr-icon"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  CreditCard, 
  History, 
  Plus, 
  ShieldCheck,
  ChevronRight,
  Loader2
} from "lucide-react"

export default function HomeownerPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const userId = user.id || user.UserID
      
      if (userId) {
        fetch(`/api/proxy?path=${encodeURIComponent(`/api/payments/homeowner/${userId}`)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setPayments(data)
            }
            setLoading(false)
          })
          .catch(err => {
            console.error("Error fetching payments:", err)
            setLoading(false)
          })
      }
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Manage your payment methods and transaction history</p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 w-4 h-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Payment Methods */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Saved Methods</CardTitle>
              <CardDescription>Your saved credit and debit cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>Recent payments for your projects</CardDescription>
              </div>
              <History className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <PkrIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{payment.job_title || 'Project Payment'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(payment.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">RS {payment.amount}</p>
                        <p className="text-[10px] text-success uppercase font-semibold">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <PkrIcon className="w-12 h-12 mx-auto mb-3 opacity-10" />
                  <p>No transactions found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldCheck className="w-24 h-24 rotate-12" />
             </div>
             <CardHeader>
               <CardTitle>Secure Payments</CardTitle>
               <CardDescription className="text-primary-foreground/70">
                 Your data is protected with industry-standard encryption.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <Button variant="secondary" className="w-full">
                 View Security Policy
                 <ChevronRight className="ml-2 w-4 h-4" />
               </Button>
             </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
               <div className="flex justify-between items-center pb-2 border-b border-border/50">
                 <span className="text-muted-foreground">Total Spent</span>
                 <span className="font-semibold text-lg">
                   RS {payments.reduce((acc, p) => acc + (p.amount || 0), 0)}
                 </span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-border/50">
                 <span className="text-muted-foreground">Projects Funded</span>
                 <span className="font-semibold">{payments.length}</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
