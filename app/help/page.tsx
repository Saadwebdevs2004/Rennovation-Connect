"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, ChevronDown, MessageSquare, Phone, Mail, ArrowLeft } from "lucide-react"

export default function HelpCenterPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I post a new job?",
      answer: "To post a new job, navigate to your dashboard and click the 'Post a Job' button. Fill out the details including the title, description, budget, and required skills, then submit."
    },
    {
      question: "How do I accept a bid from a professional?",
      answer: "Go to your 'Bids' page from the dashboard sidebar. Review the submitted bids for your jobs. Click 'Accept Bid' on the one you prefer. This will notify the professional so you can start coordinating."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, all payments processed through Renovation Connect use industry-standard encryption. We hold funds securely until the milestone is approved by the homeowner."
    },
    {
      question: "How can I change my notification settings?",
      answer: "Click on your profile picture in the top right corner, select 'Settings', and navigate to the 'Notifications' tab. You can toggle email and push notifications from there."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "If a dispute arises, both parties can open a support ticket. Our moderation team will review the job agreement, messages, and evidence provided to mediate a fair resolution."
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBack = () => {
    // If we have a user in localstorage, figure out their role to go back to the right dashboard
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed.role) {
          router.push(`/${parsed.role}/dashboard`)
          return
        }
      } catch(e) {}
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border flex items-center px-4 lg:px-8">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="font-bold text-xl tracking-tight text-primary">
          Renovation Connect <span className="text-foreground font-medium">Help Center</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Search Hero */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How can we help you?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search our knowledge base or browse frequently asked questions below.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for articles, guides, or keywords..."
              className="pl-12 py-6 text-lg rounded-2xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground mt-1">Talk to our support team instantly.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground mt-1">Get an answer within 24 hours.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground mt-1">Available Mon-Fri, 9am-5pm PKT.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-6 pt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">Find quick answers to common issues.</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No matching FAQs found for "{searchQuery}".</p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:border-primary/30 transition-colors overflow-hidden"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="p-4 md:p-6 flex items-center justify-between">
                    <h3 className="font-medium text-lg pr-4">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === index && (
                    <div className="px-4 md:px-6 pb-6 pt-0 animate-fade-in text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
