"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Receipt } from "lucide-react"
import { MockPaymentForm } from "@/components/payment/mock-payment-form"
import { ManualTransferForm } from "@/components/payment/manual-transfer-form"
import React from "react"

export default function PaymentCheckoutPage({ params }: { params: Promise<{ jobId: string }> }) {
  const router = useRouter()
  const { jobId } = React.use(params)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch job details to know how much to pay
    fetch(`/api/proxy?path=${encodeURIComponent(`/api/jobs/${jobId}`)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // For demo purposes, we'll just use budgetMin or a fixed amount if missing
          setJob({
            id: data.id,
            title: data.title,
            amount: data.budgetMin || 5000, 
            workerId: data.workerId || 1 // Fallback
          })
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch job for payment:", err)
        setLoading(false)
      })
  }, [jobId])

  const handlePaymentSuccess = async (method: 'credit_card' | 'manual') => {
    try {
      const savedUser = (localStorage.getItem('user') || sessionStorage.getItem('user'));
      const user = savedUser ? JSON.parse(savedUser) : null;
      const homeownerId = user?.id || user?.UserID || 1;

      // Status logic: 
      // Credit Card is instantly completed
      // Manual Transfer goes to 'pending_approval' for worker to approve
      const status = method === 'credit_card' ? 'completed' : 'pending_approval';

      // Record the payment in the backend
      const response = await fetch('/api/proxy?path=%2Fapi%2Fpayments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          homeowner_id: homeownerId,
          worker_id: job.workerId,
          amount: job.amount,
          method: method,
          status: status
        })
      });

      if (!response.ok) {
        throw new Error("Failed to record payment in database");
      }

      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        router.push('/homeowner/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Failed to record payment", error);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading checkout...</div>
  }

  if (!job) {
    return <div className="p-8 text-center text-destructive">Job not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="text-muted-foreground">Complete payment for: {job.title}</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
          <CardTitle className="flex justify-between items-center text-xl">
            <span>Amount Due</span>
            <span className="text-primary text-2xl">RS {job.amount.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="card" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Credit Card (Demo)
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Bank Transfer
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="card" className="px-6 pb-6 mt-0">
              <MockPaymentForm 
                amount={job.amount} 
                jobTitle={job.title}
                onSuccess={() => handlePaymentSuccess('credit_card')}
              />
            </TabsContent>

            <TabsContent value="manual" className="px-6 pb-6 mt-0">
              <ManualTransferForm 
                amount={job.amount} 
                jobTitle={job.title}
                onSuccess={() => handlePaymentSuccess('manual')}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
