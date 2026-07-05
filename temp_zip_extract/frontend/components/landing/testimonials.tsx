"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Homeowner",
    location: "DHA Phase 6, Lahore",
    image: "AR",
    rating: 5,
    text: "Finally found a reliable electrician in Lahore without the typical hassle. The verification process makes a huge difference — I felt safe having them in my home.",
  },
  {
    name: "M. Zeeshan",
    role: "Contractor",
    location: "Bahria Town, Islamabad",
    image: "MZ",
    rating: 5,
    text: "As a contractor, finding genuine clients used to be hard. Now I get serious inquiries and the secure payment system ensures I get paid on time, every time.",
  },
  {
    name: "Sana Malik",
    role: "Homeowner",
    location: "Gulshan-e-Iqbal, Karachi",
    image: "SM",
    rating: 5,
    text: "Getting my kitchen renovated was so stressful until I used this platform. Being able to compare bids and see previous work saved me from making a costly mistake.",
  },
  {
    name: "Bilal Sheikh",
    role: "Electrician",
    location: "Model Town, Lahore",
    image: "BS",
    rating: 5,
    text: "The support for workers is amazing. I only pick up jobs that are close to me and match my expertise. It's much better than looking for work through word-of-mouth.",
  },
  {
    name: "Ayesha Siddiqua",
    role: "Homeowner",
    location: "Hayatabad, Peshawar",
    image: "AS",
    rating: 5,
    text: "Within 24 hours of posting, I had 5 competitive bids for my bathroom repair. The transparency in pricing is something we've really been missing in Pakistan.",
  },
  {
    name: "Farhan Ahmed",
    role: "Interior Designer",
    location: "F-11, Islamabad",
    image: "FA",
    rating: 5,
    text: "A professional platform that actually respects the craft. The milestone payments protect both me and my clients. Highly recommended for any serious pro.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Loved by Homeowners & Professionals
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our community has to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.image}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
