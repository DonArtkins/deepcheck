"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield, ChevronDown } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <p>DEEP<span className="text-primary">CHECK</span></p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 font-mono text-sm">
              <Link href="#features" className="hover:text-primary transition-colors">
                FEATURES
              </Link>
              <Link href="#technology" className="hover:text-primary transition-colors">
                TECHNOLOGY
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  SOLUTIONS
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    <Link href="/enterprise" className="block px-3 py-2 text-sm hover:bg-accent rounded">
                      Enterprise
                    </Link>
                    <Link href="/api-access" className="block px-3 py-2 text-sm hover:bg-accent rounded">
                      API Access
                    </Link>
                    <Link href="/forensics" className="block px-3 py-2 text-sm hover:bg-accent rounded">
                      Digital Forensics
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="#pricing" className="hover:text-primary transition-colors">
                PRICING
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-mono">
                  SIGN IN
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="font-mono">
                  START FREE
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-4 font-mono text-sm">
              <Link href="#features" className="block hover:text-primary transition-colors">
                FEATURES
              </Link>
              <Link href="#technology" className="block hover:text-primary transition-colors">
                TECHNOLOGY
              </Link>
              <Link href="#pricing" className="block hover:text-primary transition-colors">
                PRICING
              </Link>
              <div className="pt-4 border-t border-border space-y-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="w-full font-mono">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="w-full font-mono">
                    START FREE
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
