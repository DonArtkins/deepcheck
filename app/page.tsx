import { Navigation } from "@/components/navigation";
import { ParticleBackground } from "@/components/particle-background";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { TechnologyShowcase } from "@/components/technology-showcase";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <TechnologyShowcase />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
