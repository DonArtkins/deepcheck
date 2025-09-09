"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Save,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wider">
            SYSTEM SETTINGS
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Configure your account and system preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Row - Profile, Security, Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                PROFILE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-300 text-xs font-medium tracking-wider">
                  FULL NAME
                </Label>
                <Input
                  defaultValue="John Doe"
                  className="bg-gray-800/50 border-gray-600 text-white font-mono h-10 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 text-xs font-medium tracking-wider">
                  EMAIL
                </Label>
                <Input
                  defaultValue="john.doe@company.com"
                  className="bg-gray-800/50 border-gray-600 text-white font-mono h-10 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 text-xs font-medium tracking-wider">
                  ROLE
                </Label>
                <Select defaultValue="analyst">
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white font-mono h-10 focus:border-blue-400">
                    <SelectValue />
                    <ChevronDown className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="analyst" className="text-white">
                      Security Analyst
                    </SelectItem>
                    <SelectItem value="admin" className="text-white">
                      Administrator
                    </SelectItem>
                    <SelectItem value="viewer" className="text-white">
                      Viewer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono tracking-wide h-10">
                <Save className="w-4 h-4 mr-2" />
                SAVE PROFILE
              </Button>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                SECURITY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-xs font-medium tracking-wider">
                    TWO-FACTOR AUTH
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Enhanced security
                  </p>
                </div>
                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex-1">
                  <Label className="text-gray-300 text-xs font-medium tracking-wider">
                    SESSION TIMEOUT
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Auto logout</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-20 bg-gray-700/50 border-gray-600 text-white font-mono h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="15" className="text-white">
                      15m
                    </SelectItem>
                    <SelectItem value="30" className="text-white">
                      30m
                    </SelectItem>
                    <SelectItem value="60" className="text-white">
                      1h
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700/50 font-mono tracking-wide h-10"
              >
                <Key className="w-4 h-4 mr-2" />
                CHANGE PASSWORD
              </Button>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Bell className="w-5 h-5 text-yellow-400" />
                </div>
                NOTIFICATIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-xs font-medium tracking-wider">
                    EMAIL ALERTS
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Detection results
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-xs font-medium tracking-wider">
                    PUSH NOTIFICATIONS
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Real-time alerts</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 text-xs font-medium tracking-wider">
                    SMS ALERTS
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Critical only</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, sms: checked }))
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - System Status & Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status Card */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                SYSTEM STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300 text-xs font-medium tracking-wider">
                    AI MODEL VERSION
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 font-mono border-green-500/30">
                    v2.4.1
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300 text-xs font-medium tracking-wider">
                    DATABASE STATUS
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 font-mono border-green-500/30">
                    ONLINE
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300 text-xs font-medium tracking-wider">
                    API HEALTH
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 font-mono border-green-500/30">
                    HEALTHY
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300 text-xs font-medium tracking-wider">
                    LAST BACKUP
                  </span>
                  <span className="text-gray-400 text-xs font-mono">
                    2 hours ago
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700/50 font-mono tracking-wide h-10 mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                REFRESH STATUS
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
