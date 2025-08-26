import { Navigation } from "@/components/navigation"
import { ParticleBackground } from "@/components/particle-background"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TechnologyShowcase } from "@/components/technology-showcase"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <TechnologyShowcase />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
