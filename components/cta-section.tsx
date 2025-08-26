"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Download, Play } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-mono font-bold mb-6">
            READY TO <span className="text-primary">SECURE</span> YOUR MEDIA?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of organizations using DeepCheck to verify media authenticity and combat deepfake threats.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-mono font-semibold mb-2">FREE TRIAL</h3>
                <p className="text-sm text-muted-foreground">Test our system with 10 free analyses</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-mono font-semibold mb-2">API ACCESS</h3>
                <p className="text-sm text-muted-foreground">Integrate detection into your workflow</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-mono font-semibold mb-2">ENTERPRISE</h3>
                <p className="text-sm text-muted-foreground">Custom solutions for large organizations</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-mono group">
              START FREE ANALYSIS
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="font-mono bg-transparent">
              SCHEDULE DEMO
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            No credit card required • 99.7% accuracy guarantee • Enterprise support available
          </div>
        </div>
      </div>
    </section>
  )
}
