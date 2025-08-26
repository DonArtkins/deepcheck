"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Zap, 
  Users, 
  Database, 
  Lock, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Building2,
  Globe,
  Cpu,
  Network,
  Phone,
  Mail,
  Clock
} from "lucide-react"

const enterpriseFeatures = [
  {
    icon: Shield,
    title: "Advanced Security Suite",
    description: "Military-grade encryption, SOC 2 compliance, and enterprise-level security protocols.",
    features: ["End-to-end encryption", "Zero-knowledge architecture", "Security audits", "Compliance reporting"]
  },
  {
    icon: Zap,
    title: "High-Performance Processing",
    description: "Dedicated computing resources for large-scale deepfake detection operations.",
    features: ["Dedicated GPU clusters", "Priority processing", "Batch operations", "Real-time streaming"]
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Comprehensive user management with role-based access control and permissions.",
    features: ["Role-based access", "Team collaboration", "Activity monitoring", "User provisioning"]
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Enterprise-grade data handling with backup, recovery, and retention policies.",
    features: ["Automated backups", "Data retention policies", "Export capabilities", "Analytics dashboards"]
  }
]

const pricingTiers = [
  {
    name: "PROFESSIONAL",
    price: "$2,500",
    period: "per month",
    description: "For growing organizations",
    features: [
      "Up to 50 users",
      "10,000 analyses/month",
      "Standard security features",
      "Email support",
      "Basic analytics"
    ],
    badge: null
  },
  {
    name: "ENTERPRISE",
    price: "$10,000",
    period: "per month",
    description: "For large organizations",
    features: [
      "Unlimited users",
      "100,000 analyses/month",
      "Advanced security suite",
      "Priority support",
      "Advanced analytics",
      "Custom integrations"
    ],
    badge: "POPULAR"
  },
  {
    name: "CUSTOM",
    price: "Contact Us",
    period: "tailored solution",
    description: "For specialized requirements",
    features: [
      "Custom user limits",
      "Unlimited analyses",
      "On-premise deployment",
      "Dedicated support",
      "White-label solution",
      "Custom neural models"
    ],
    badge: "PREMIUM"
  }
]

const clients = [
  { name: "DEFENSE CORP", logo: "DC" },
  { name: "MEDIA SECURE", logo: "MS" },
  { name: "GLOBAL TECH", logo: "GT" },
  { name: "CYBER SHIELD", logo: "CS" },
  { name: "DIGITAL GUARD", logo: "DG" },
  { name: "SECURE NET", logo: "SN" }
]

export default function EnterprisePage() {
  const [selectedTier, setSelectedTier] = useState(1)

  return (
    <>
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background to-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 pulse-glow mb-8">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono text-primary">ENTERPRISE SOLUTIONS</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-mono font-bold mb-6">
                SECURE YOUR <span className="text-primary">ORGANIZATION</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Deploy military-grade deepfake detection across your entire organization with enterprise-level security, scalability, and support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="font-mono pulse-glow group">
                  REQUEST DEMO
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="font-mono bg-transparent hover:bg-primary/5">
                  CONTACT SALES
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mono font-bold mb-4">
                ENTERPRISE <span className="text-secondary">CAPABILITIES</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive deepfake detection solutions designed for enterprise-scale operations
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {enterpriseFeatures.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors bg-primary/5">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-mono font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <div className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-secondary" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mono font-bold mb-4">
                ENTERPRISE <span className="text-primary">PRICING</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Flexible pricing plans designed to scale with your organization's needs
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <Card 
                  key={index}
                  className={`relative ${
                    index === selectedTier 
                      ? "border-primary bg-primary/5 pulse-glow" 
                      : "border-border hover:border-primary/30"
                  } transition-all cursor-pointer`}
                  onClick={() => setSelectedTier(index)}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground font-mono">
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-mono font-bold mb-2">{tier.name}</h3>
                      <div className="text-3xl font-mono font-bold text-primary mb-1">
                        {tier.price}
                      </div>
                      <div className="text-sm text-muted-foreground">{tier.period}</div>
                      <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full font-mono ${
                        index === selectedTier ? "pulse-glow" : ""
                      }`}
                      variant={index === selectedTier ? "default" : "outline"}
                    >
                      {tier.price === "Contact Us" ? "CONTACT SALES" : "GET STARTED"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Client Logos */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-mono font-bold text-muted-foreground">
                TRUSTED BY LEADING ORGANIZATIONS
              </h3>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {clients.map((client, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="font-mono font-bold text-primary">{client.logo}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{client.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-mono font-bold mb-4">
                  READY TO <span className="text-primary">DEPLOY?</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Get started with DeepCheck Enterprise today
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-mono font-semibold mb-2">SALES HOTLINE</h3>
                    <p className="text-muted-foreground text-sm mb-4">Speak with our enterprise team</p>
                    <p className="font-mono text-primary">+1 (555) 123-4567</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-secondary/20 bg-secondary/5">
                  <CardContent className="p-6">
                    <Mail className="w-8 h-8 text-secondary mx-auto mb-4" />
                    <h3 className="font-mono font-semibold mb-2">EMAIL SUPPORT</h3>
                    <p className="text-muted-foreground text-sm mb-4">Get detailed information</p>
                    <p className="font-mono text-secondary">enterprise@deepcheck.ai</p>
                  </CardContent>
                </Card>

                <Card className="text-center border-accent/20 bg-accent/5">
                  <CardContent className="p-6">
                    <Clock className="w-8 h-8 text-accent mx-auto mb-4" />
                    <h3 className="font-mono font-semibold mb-2">RESPONSE TIME</h3>
                    <p className="text-muted-foreground text-sm mb-4">Enterprise priority support</p>
                    <p className="font-mono text-accent">4 HOURS</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button size="lg" className="font-mono pulse-glow">
                  SCHEDULE CONSULTATION
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}