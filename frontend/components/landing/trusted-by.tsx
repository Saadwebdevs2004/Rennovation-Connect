"use client"

import { Building2 } from "lucide-react"

const partners = [
  { name: "HomeAdvisor", stat: "20 days", desc: "average project completion" },
  { name: "BuildTrust", stat: "98%", desc: "customer satisfaction" },
  { name: "ProConnect", stat: "300%", desc: "increase in qualified leads" },
  { name: "TradeMax", stat: "6x", desc: "faster hiring process" },
]

export function TrustedBy() {
  return (
    <section className="py-12 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by industry leaders
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="flex flex-col items-center text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-2 text-muted-foreground group-hover:text-foreground transition-colors">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">{partner.name}</span>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{partner.stat}</p>
              <p className="text-sm text-muted-foreground">{partner.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
