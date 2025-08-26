import Link from "next/link"
import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono font-bold text-xl">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>DEEPCHECK</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Advanced AI-powered deepfake detection system for media authenticity verification.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-mono font-semibold mb-4">PRODUCT</h3>
            <div className="space-y-3 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                API Documentation
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Enterprise
              </Link>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-mono font-semibold mb-4">SOLUTIONS</h3>
            <div className="space-y-3 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Media Verification
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Digital Forensics
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Content Moderation
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Security Auditing
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-mono font-semibold mb-4">SUPPORT</h3>
            <div className="space-y-3 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Status Page
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">© 2024 DeepCheck. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
