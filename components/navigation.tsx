"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-background/80 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-4 lg:gap-6 font-mono text-sm">
              <Link
                href="#features"
                className="hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                FEATURES
              </Link>
              <Link
                href="#technology"
                className="hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                TECHNOLOGY
              </Link>
              <Link
                href="#contact"
                className="hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                CONTACT
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-sm hover:text-primary hover:bg-primary/10"
                >
                  SIGN IN
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="font-mono text-sm pulse-glow">
                  START FREE
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 border-t border-border"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-6 space-y-4 font-mono text-sm">
            <Link
              href="#features"
              className="block py-2 px-4 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              onClick={handleLinkClick}
            >
              FEATURES
            </Link>
            <Link
              href="#technology"
              className="block py-2 px-4 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              onClick={handleLinkClick}
            >
              TECHNOLOGY
            </Link>
            <Link
              href="#contact"
              className="block py-2 px-4 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              onClick={handleLinkClick}
            >
              CONTACT
            </Link>

            <div className="pt-6 border-t border-border space-y-3 flex flex-col gap-5 py-6">
              <Link href="/auth/login" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center font-mono hover:text-primary hover:bg-primary/10"
                >
                  SIGN IN
                </Button>
              </Link>
              <Link href="/auth/register" onClick={handleLinkClick}>
                <Button
                  size="sm"
                  className="w-full justify-center font-mono pulse-glow"
                >
                  START FREE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
