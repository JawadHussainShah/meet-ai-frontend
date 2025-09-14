"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Bell,
  Shield,
  Zap,
  Trash2,
  Camera,
  Check,
  LinkIcon,
  Unlink,
  Calendar,
  Video,
  Mail,
  Globe,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

const integrations = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync meetings from your Google Calendar",
    icon: Calendar,
    connected: true,
    lastSync: "2 hours ago",
    meetings: 12,
  },
  {
    id: "outlook-calendar",
    name: "Outlook Calendar",
    description: "Sync meetings from your Outlook Calendar",
    icon: Calendar,
    connected: false,
    lastSync: null,
    meetings: 0,
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Import recordings and transcripts from Zoom",
    icon: Video,
    connected: true,
    lastSync: "1 day ago",
    meetings: 8,
  },
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Import recordings and transcripts from Google Meet",
    icon: Video,
    connected: true,
    lastSync: "3 hours ago",
    meetings: 4,
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Import recordings and transcripts from Teams",
    icon: Video,
    connected: false,
    lastSync: null,
    meetings: 0,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Share meeting summaries in Slack channels",
    icon: Mail,
    connected: false,
    lastSync: null,
    meetings: 0,
  },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    company: "",
    role: "",
    timezone: "UTC-8 (Pacific Time)",
  })

  const [notifications, setNotifications] = useState({
    email_summaries: true,
    meeting_reminders: true,
    action_item_updates: false,
    weekly_reports: true,
    security_alerts: true,
  })

  const [privacy, setPrivacy] = useState({
    data_retention: "1_year",
    share_analytics: false,
    improve_ai: true,
  })

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleIntegrationToggle = (integrationId: string, connect: boolean) => {
    if (connect) {
      toast({
        title: "Integration connected",
        description: "Successfully connected to the service.",
      })
    } else {
      toast({
        title: "Integration disconnected",
        description: "Successfully disconnected from the service.",
      })
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={"https://cdn-icons-png.flaticon.com/512/6596/6596121.png"} />
                  <AvatarFallback className="text-lg">
                    {profile.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{profile.full_name || user?.email}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter your company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                    placeholder="Enter your role"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                    placeholder="Select your timezone"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Connected Integrations
              </CardTitle>
              <CardDescription>Manage your connected services and platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <integration.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      {integration.connected && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {integration.lastSync} • {integration.meetings} meetings
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.connected ? (
                      <>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Connected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIntegrationToggle(integration.id, false)}
                        >
                          <Unlink className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleIntegrationToggle(integration.id, true)}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about meeting updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Summaries</h4>
                    <p className="text-sm text-muted-foreground">Receive email summaries after each meeting</p>
                  </div>
                  <Switch
                    checked={notifications.email_summaries}
                    onCheckedChange={(value) => handleNotificationChange("email_summaries", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Meeting Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get notified before upcoming meetings</p>
                  </div>
                  <Switch
                    checked={notifications.meeting_reminders}
                    onCheckedChange={(value) => handleNotificationChange("meeting_reminders", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Action Item Updates</h4>
                    <p className="text-sm text-muted-foreground">Notifications when action items are completed</p>
                  </div>
                  <Switch
                    checked={notifications.action_item_updates}
                    onCheckedChange={(value) => handleNotificationChange("action_item_updates", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-muted-foreground">Weekly summary of your meeting analytics</p>
                  </div>
                  <Switch
                    checked={notifications.weekly_reports}
                    onCheckedChange={(value) => handleNotificationChange("weekly_reports", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Security Alerts</h4>
                    <p className="text-sm text-muted-foreground">Important security and account notifications</p>
                  </div>
                  <Switch
                    checked={notifications.security_alerts}
                    onCheckedChange={(value) => handleNotificationChange("security_alerts", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your data privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Data Retention</h4>
                  <p className="text-sm text-muted-foreground mb-3">How long should we keep your meeting data?</p>
                  <div className="space-y-2">
                    {[
                      { value: "3_months", label: "3 months" },
                      { value: "6_months", label: "6 months" },
                      { value: "1_year", label: "1 year" },
                      { value: "forever", label: "Forever" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={option.value}
                          name="data_retention"
                          value={option.value}
                          checked={privacy.data_retention === option.value}
                          onChange={(e) => setPrivacy((prev) => ({ ...prev, data_retention: e.target.value }))}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage analytics to improve our service
                    </p>
                  </div>
                  <Switch
                    checked={privacy.share_analytics}
                    onCheckedChange={(value) => setPrivacy((prev) => ({ ...prev, share_analytics: value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Improve AI Models</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your data to help improve our AI transcription and analysis
                    </p>
                  </div>
                  <Switch
                    checked={privacy.improve_ai}
                    onCheckedChange={(value) => setPrivacy((prev) => ({ ...prev, improve_ai: value }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <div className="border border-red-200 rounded-lg p-4 space-y-3">
                  <div>
                    <h5 className="font-medium">Export Data</h5>
                    <p className="text-sm text-muted-foreground">Download all your meeting data and transcripts</p>
                  </div>
                  <Button variant="outline">
                    <Globe className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>

                <div className="border border-red-200 rounded-lg p-4 space-y-3">
                  <div>
                    <h5 className="font-medium text-red-600">Delete Account</h5>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}