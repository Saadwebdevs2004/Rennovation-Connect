"use client"

const stats = [
  { value: "50K+", label: "Projects Completed", description: "Successful renovations" },
  { value: "15K+", label: "Verified Pros", description: "Licensed professionals" },
  { value: "98%", label: "Satisfaction Rate", description: "Happy customers" },
  { value: "RS 5B+", label: "Paid to Workers", description: "In secure payments" },
]

export function Stats() {
  return (
    <section className="py-12 lg:py-28 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient Overlay Removed to show canvas */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform has helped homeowners and professionals connect for years.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-3xl lg:text-5xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform">
                  {stat.value}
                </p>
                <p className="text-lg font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
