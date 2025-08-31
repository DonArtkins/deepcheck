"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  Shield,
  User,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import LoadingOverlay from "@/components/ui/loading-overlay";

const navigationItems = [
  {
    title: "OVERVIEW",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "System status and analytics",
  },
  {
    title: "UPLOAD & ANALYZE",
    href: "/dashboard/upload",
    icon: Upload,
    description: "Upload media for detection",
  },
  {
    title: "DETECTION HISTORY",
    href: "/dashboard/history",
    icon: History,
    description: "View past analyses",
  },
  {
    title: "ANALYTICS",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Detailed reports and insights",
  },
  {
    title: "SETTINGS",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account and system preferences",
  },
  {
    title: "HELP & SUPPORT",
    href: "/dashboard/help",
    icon: HelpCircle,
    description: "Documentation and support",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading overlay for authentication check
  if (isLoading) {
    return <LoadingOverlay message="Initializing system..." isVisible={true} />;
  }

  // Show loading overlay for logout
  if (isLoggingOut) {
    return <LoadingOverlay message="Securing session..." isVisible={true} />;
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user display name and role
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email;
  const userRole = user.role
    ? user.role
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "User";

  return (
    <Suspense fallback={<LoadingOverlay message="Loading interface..." />}>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-16"
          } hidden lg:block`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="DeepCheck Icon"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
                {sidebarOpen && (
                  <div className="flex-1">
                    <h1 className="font-mono font-bold text-lg">DEEPCHECK</h1>
                    <p className="text-xs text-muted-foreground">
                      Detection System
                    </p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-accent"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm font-medium">
                            {item.title}
                          </div>
                          <div className="text-xs opacity-70 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r-full" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono text-sm font-medium truncate"
                      title={displayName}
                    >
                      {displayName}
                    </div>
                    <div
                      className="text-xs text-muted-foreground truncate"
                      title={userRole}
                    >
                      {userRole}
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-card border-r border-border">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center pulse-glow">
                          <Shield className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h1 className="font-mono font-bold text-lg">
                            DEEPCHECK
                          </h1>
                          <p className="text-xs text-muted-foreground">
                            Detection System
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(false)}
                        className="hover:bg-accent"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div
                            className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm font-medium">
                                {item.title}
                              </div>
                              <div className="text-xs opacity-70 truncate">
                                {item.description}
                              </div>
                            </div>
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r-full" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* User Profile */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-mono text-sm font-medium truncate"
                          title={displayName}
                        >
                          {displayName}
                        </div>
                        <div
                          className="text-xs text-muted-foreground truncate"
                          title={userRole}
                        >
                          {userRole}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-16"
          }`}
        >
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden hover:bg-accent"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search analyses..."
                    className="w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-accent"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </Button>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
