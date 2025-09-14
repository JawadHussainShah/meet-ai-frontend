"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, RefreshCw, CheckCircle, AlertCircle, Clock, Users, ExternalLink, Loader2 } from 'lucide-react'
import { calendarApi, CalendarIntegrationStatus, CalendarStatsResponse } from "@/lib/calendar-api"
import { useToast } from "@/hooks/use-toast"

export default function CalendarSync() {
  const [integrationStatus, setIntegrationStatus] = useState<CalendarIntegrationStatus>({
    connected: false,
    needs_reauth: false
  })
  const [stats, setStats] = useState<CalendarStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
    
    // Listen for OAuth callback messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === "CALENDAR_OAUTH_SUCCESS") {
        toast({
          title: "Calendar Connected",
          description: "Your Google Calendar has been successfully connected!",
        })
        loadData()
      } else if (event.data.type === "CALENDAR_OAUTH_ERROR") {
        toast({
          title: "Connection Failed",
          description: event.data.error || "Failed to connect calendar",
          variant: "destructive",
        })
        setIsConnecting(false)
      }
    }
    
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [toast])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [statusData, statsData] = await Promise.all([
        calendarApi.getIntegrationStatus(),
        calendarApi.getCalendarStats().catch(() => null)
      ])
      
      setIntegrationStatus(statusData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading calendar data:", error)
      toast({
        title: "Error",
        description: "Failed to load calendar data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsConnecting(false)
    }
  }

  const handleConnectCalendar = async () => {
    try {
      setIsConnecting(true)
      const authData = await calendarApi.getCalendarAuthUrl("google")
      
      // Open OAuth popup
      const popup = window.open(
        authData.auth_url,
        "calendar-oauth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      )
      
      if (!popup) {
        throw new Error("Popup blocked. Please allow popups for this site.")
      }
      
      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          setIsConnecting(false)
        }
      }, 1000)
      
    } catch (error) {
      console.error("Error connecting calendar:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect calendar",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const handleSyncCalendar = async () => {
    try {
      setIsSyncing(true)
      const result = await calendarApi.syncCalendar({
        force_refresh: true
      })
      
      toast({
        title: "Sync Complete",
        description: `Synced ${result.total_events} events successfully`,
      })
      
      loadData()
    } catch (error) {
      console.error("Error syncing calendar:", error)
      toast({
        title: "Sync Failed",
        description: "Failed to sync calendar events",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnectCalendar = async () => {
    try {
      await calendarApi.disconnectCalendar()
      toast({
        title: "Calendar Disconnected",
        description: "Your calendar has been disconnected",
      })
      loadData()
    } catch (error) {
      console.error("Error disconnecting calendar:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect calendar",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading calendar data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integration
          </CardTitle>
          <CardDescription>
            Connect your Google Calendar to automatically sync meetings and schedule AI notetaking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {integrationStatus.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>
            
            {integrationStatus.connected ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSyncCalendar}
                  disabled={isSyncing}
                  variant="outline"
                  size="sm"
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Now
                </Button>
                <Button
                  onClick={handleDisconnectCalendar}
                  variant="outline"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectCalendar}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Connect Google Calendar
              </Button>
            )}
          </div>

          {integrationStatus.connected && integrationStatus.provider && (
            <div className="text-sm text-gray-600">
              <p>Provider: {integrationStatus.provider}</p>
              {integrationStatus.last_sync && (
                <p>Last sync: {new Date(integrationStatus.last_sync).toLocaleString()}</p>
              )}
            </div>
          )}

          {integrationStatus.needs_reauth && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your calendar connection needs to be refreshed. Please reconnect your calendar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {stats && integrationStatus.connected && (
        <Card>
          <CardHeader>
            <CardTitle>Calendar Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_events}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.upcoming_events}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.events_with_meetings}</div>
                <div className="text-sm text-gray-600">With Meetings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.active_integrations}</div>
                <div className="text-sm text-gray-600">Integrations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!integrationStatus.connected && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Connect Your Calendar</h3>
                <p className="text-gray-600 mt-2">
                  Connect your Google Calendar to automatically sync your meetings and enable AI notetaking for your calls.
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Automatic meeting detection</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>AI notetaker scheduling</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Meeting transcription and insights</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}