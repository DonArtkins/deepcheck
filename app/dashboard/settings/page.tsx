"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Palette, Database, Key, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-mono font-bold">SYSTEM SETTINGS</h1>
        <p className="text-muted-foreground mt-1">Configure your account and system preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <User className="w-5 h-5" />
              PROFILE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono text-sm">FULL NAME</Label>
              <Input defaultValue="John Doe" className="font-mono bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-sm">EMAIL</Label>
              <Input defaultValue="john.doe@company.com" className="font-mono bg-transparent" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-sm">ROLE</Label>
              <Select defaultValue="analyst">
                <SelectTrigger className="font-mono bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analyst">Security Analyst</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full font-mono">
              <Save className="w-4 h-4 mr-2" />
              SAVE PROFILE
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Shield className="w-5 h-5" />
              SECURITY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-mono text-sm">TWO-FACTOR AUTH</Label>
                <p className="text-xs text-muted-foreground">Enhanced security</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-mono text-sm">SESSION TIMEOUT</Label>
                <p className="text-xs text-muted-foreground">Auto logout</p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-20 font-mono bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15m</SelectItem>
                  <SelectItem value="30">30m</SelectItem>
                  <SelectItem value="60">1h</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full font-mono bg-transparent">
              <Key className="w-4 h-4 mr-2" />
              CHANGE PASSWORD
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Bell className="w-5 h-5" />
              NOTIFICATIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-mono text-sm">EMAIL ALERTS</Label>
                <p className="text-xs text-muted-foreground">Detection results</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-mono text-sm">PUSH NOTIFICATIONS</Label>
                <p className="text-xs text-muted-foreground">Real-time alerts</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-mono text-sm">SMS ALERTS</Label>
                <p className="text-xs text-muted-foreground">Critical only</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Database className="w-5 h-5" />
              SYSTEM STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">AI MODEL VERSION</span>
              <Badge variant="secondary" className="font-mono">
                v2.4.1
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">DATABASE STATUS</span>
              <Badge variant="secondary" className="font-mono text-secondary">
                ONLINE
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">API HEALTH</span>
              <Badge variant="secondary" className="font-mono text-secondary">
                HEALTHY
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">LAST BACKUP</span>
              <span className="font-mono text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <Button variant="outline" className="w-full font-mono bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              REFRESH STATUS
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Palette className="w-5 h-5" />
              PREFERENCES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono text-sm">THEME</Label>
              <Select defaultValue="dark">
                <SelectTrigger className="font-mono bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-sm">LANGUAGE</Label>
              <Select defaultValue="en">
                <SelectTrigger className="font-mono bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-sm">TIMEZONE</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="font-mono bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
