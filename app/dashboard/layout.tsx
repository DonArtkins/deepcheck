"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
  Search,
  Activity,
  Zap,
  ChevronRight,
  UserCog,
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowProfileMenu(false);
    try {
      logout();
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
            <div
              className={`border-b border-border transition-all duration-300 ${
                sidebarOpen ? "p-4" : "p-2"
              }`}
            >
              <div
                className={`flex items-center transition-all duration-300 ${
                  sidebarOpen ? "gap-3" : "flex-col gap-2"
                }`}
              >
                <div className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="DeepCheck Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
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
                  className={`hover:bg-accent flex-shrink-0 transition-all duration-300 ${
                    sidebarOpen ? "w-8 h-8 p-0" : "w-8 h-8 p-0"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav
              className={`flex-1 space-y-1 transition-all duration-300 ${
                sidebarOpen ? "p-4" : "p-2"
              }`}
            >
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`group relative flex items-center rounded-lg transition-all duration-200 ${
                        sidebarOpen
                          ? "gap-3 px-3 py-3"
                          : "justify-center px-2 py-3"
                      } ${
                        isActive
                          ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20"
                          : "hover:bg-accent/50 hover:text-accent-foreground"
                      }`}
                      title={!sidebarOpen ? item.title : undefined}
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
                        <div
                          className={`absolute bg-primary rounded-full ${
                            sidebarOpen
                              ? "left-0 top-0 bottom-0 w-1"
                              : "top-0 left-0 right-0 h-1"
                          }`}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Section */}
            <div
              className={`border-t border-border relative transition-all duration-300 ${
                sidebarOpen ? "p-4" : "p-2"
              }`}
              ref={profileMenuRef}
            >
              {/* Profile Button */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-full group relative flex rounded-lg hover:bg-accent/50 transition-all duration-200 ${
                  sidebarOpen
                    ? "items-center gap-3 px-3 py-3"
                    : "flex-col items-center justify-center px-2 py-2"
                }`}
                title={!sidebarOpen ? displayName : undefined}
              >
                <div
                  className={`bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center flex-shrink-0 ${
                    sidebarOpen ? "w-10 h-10" : "w-8 h-8"
                  }`}
                >
                  <User
                    className={`text-primary-foreground ${
                      sidebarOpen ? "w-5 h-5" : "w-4 h-4"
                    }`}
                  />
                </div>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-mono text-sm font-medium truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {userRole}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        showProfileMenu ? "rotate-90" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {/* Profile Popup Menu */}
              {showProfileMenu && (
                <div
                  className={`absolute bg-card border border-border rounded-xl shadow-2xl z-50 transition-all duration-200 ${
                    sidebarOpen
                      ? "bottom-full left-4 right-4 mb-2"
                      : "bottom-2 left-full ml-2 w-48"
                  }`}
                >
                  <div className="p-2 space-y-1">
                    {!sidebarOpen && (
                      <div className="px-3 py-2 border-b border-border">
                        <div className="font-mono text-sm font-medium truncate">
                          {displayName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {userRole}
                        </div>
                      </div>
                    )}
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <UserCog className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="font-mono text-sm">View Profile</span>
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors group w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-mono text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
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
                        <Image
                          src="/logo.png"
                          alt="DeepCheck Icon"
                          width={40}
                          height={40}
                          className="w-10 h-10"
                        />
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
                        className="hover:bg-accent w-8 h-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div
                            className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
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
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile User Profile */}
                  <div className="p-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2 bg-accent/20 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-medium truncate">
                          {displayName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {userRole}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                      >
                        <UserCog className="w-4 h-4" />
                        <span className="font-mono text-xs">Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-mono text-xs">Logout</span>
                      </button>
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
            <div className="flex items-center justify-between px-4 py-[19px]">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden hover:bg-accent w-8 h-8 p-0"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search analyses..."
                    className="w-48 sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* System Status Indicator */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-mono text-xs text-green-600 dark:text-green-400">
                    SYSTEM ONLINE
                  </span>
                </div>

                {/* Performance Indicator */}
                <div className="flex items-center gap-2 px-3 py-2 bg-accent/20 rounded-lg border border-border">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-xs text-muted-foreground">
                    99.9%
                  </span>
                </div>

                {/* Quick Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all duration-200"
                  onClick={() => router.push("/dashboard/upload")}
                >
                  <Zap className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">QUICK SCAN</span>
                  <span className="sm:hidden">SCAN</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
