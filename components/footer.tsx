import Link from "next/link";
import { Shield, Github, Mail, GlobeLock } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-mono font-bold text-lg sm:text-xl"
            >
              <Image
                src="/logo.png"
                alt="DeepCheck Icon"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span>
                DEEP<span className="text-primary">CHECK</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Advanced AI-powered deepfake detection system for media
              authenticity verification.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://deepcheckai.vercel.app"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Visit our website"
              >
                <GlobeLock className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/DonArtkins/deepcheck"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:contact@deepcheck.ai"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Send us an email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-mono font-semibold text-sm sm:text-base">
              PRODUCT
            </h3>
            <div className="space-y-2 sm:space-y-3 text-sm">
              <Link
                href="/#features"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                API Documentation
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Enterprise
              </Link>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="font-mono font-semibold text-sm sm:text-base">
              SOLUTIONS
            </h3>
            <div className="space-y-2 sm:space-y-3 text-sm">
              <Link
                href="/#features"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Media Verification
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Digital Forensics
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Content Moderation
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Security Auditing
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-mono font-semibold text-sm sm:text-base">
              SUPPORT
            </h3>
            <div className="space-y-2 sm:space-y-3 text-sm">
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="#contact"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Status Page
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 lg:mt-12 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            &copy; 2025 DeepCheck. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
