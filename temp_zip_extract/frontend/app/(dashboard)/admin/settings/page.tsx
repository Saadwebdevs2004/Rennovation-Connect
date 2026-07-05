"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Shield, Settings, Bell, Database, Lock, Globe } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">System Configuration</h1>
        <p className="text-muted-foreground mt-1">Manage global platform settings and security</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Globe className="w-5 h-5" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Platform-wide basic configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="Renovation Connect" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">System Support Email</Label>
              <Input id="supportEmail" defaultValue="support@renoconnect.com" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Take the platform offline for updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Shield className="w-5 h-5" />
              <CardTitle>Security & Access</CardTitle>
            </div>
            <CardDescription>Manage authentication and safety rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">New User Registration</p>
                <p className="text-xs text-muted-foreground">Allow new homeowners and workers to join</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Admin Approval Required</p>
                <p className="text-xs text-muted-foreground">Manual verification for all workers</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button className="w-full" variant="outline">
               <Lock className="w-4 h-4 mr-2" />
               Update Security Protocols
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Database className="w-5 h-5" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>Database backups and system logs</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" variant="outline">Download Full Backup</Button>
            <Button className="flex-1" variant="outline">View Error Logs</Button>
            <Button className="flex-1" variant="destructive">Clear System Cache</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
