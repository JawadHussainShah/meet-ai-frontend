"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Clock, Users, Video, MapPin, Loader2, AlertCircle, RefreshCw, ExternalLink, CheckCircle, Plus, Settings, CalendarIcon as CalendarLucide } from 'lucide-react'
import { calendarAPI, type CalendarEvent, type CalendarIntegration, type CalendarStats } from "@/lib/calendar-api"
import { useToast } from "@/hooks/use-toast"
import { format, isToday, isTomorrow, isThisWeek, parseISO, startOfDay, endOfDay } from "date-fns"

interface CalendarPageState {
  integrations: CalendarIntegration[]
  events: CalendarEvent[]
  stats: CalendarStats | null
  loading: boolean
  syncing: boolean
  connecting: boolean
  selectedDate: Date
  activeTab: string
}

export default function CalendarPage() {
  const [state, setState] = useState<CalendarPageState>({
    integrations: [],
    events: [],
    stats: null,
    loading: true,
    syncing: false,
    connecting: false,
    selectedDate: new Date(),
    activeTab: "upcoming"
  })
  
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
        setState(prev => ({ ...prev, connecting: false }))
      }
    }
    
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [toast])

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const [integrations, stats] = await Promise.all([
        calendarAPI.getIntegrations(),
        calendarAPI.getStats().catch(() => null)
      ])
      
      setState(prev => ({ ...prev, integrations, stats }))
      
      // Load events if we have active integrations
      const activeIntegration = integrations.find(i => i.is_active)
      if (activeIntegration) {
        const events = await calendarAPI.getEvents({
          start_date: format(new Date(), 'yyyy-MM-dd'),
          limit: 100
        })
        setState(prev => ({ ...prev, events }))
      }
    } catch (error: any) {
      console.error("Failed to load calendar data:", error)
      toast({
        title: "Error",
        description: "Failed to load calendar data",
        variant: "destructive",
      })
    } finally {
      setState(prev => ({ ...prev, loading: false, connecting: false }))
    }
  }

  const handleConnectCalendar = async () => {
    try {
      setState(prev => ({ ...prev, connecting: true }))
      const authData = await calendarAPI.getAuthUrl()
      
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
          setState(prev => ({ ...prev, connecting: false }))
        }
      }, 1000)
      
    } catch (error) {
      console.error("Error connecting calendar:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect calendar",
        variant: "destructive",
      })
      setState(prev => ({ ...prev, connecting: false }))
    }
  }

  const handleSyncCalendar = async () => {
    try {
      setState(prev => ({ ...prev, syncing: true }))
      const result = await calendarAPI.syncCalendar({
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
      setState(prev => ({ ...prev, syncing: false }))
    }
  }

  const handleDisconnectCalendar = async (integrationId: number) => {
    try {
      await calendarAPI.disconnectIntegration(integrationId)
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

  const filterEvents = (events: CalendarEvent[], filter: string) => {
    const now = new Date()

    switch (filter) {
      case "upcoming":
        return events.filter(event => parseISO(event.start_time) > now)
      case "completed":
        return events.filter(event => parseISO(event.end_time) < now)
      case "today":
        return events.filter(event => isToday(parseISO(event.start_time)))
      case "this-week":
        return events.filter(event => isThisWeek(parseISO(event.start_time)))
      case "with-meetings":
        return events.filter(event => calendarAPI.hasMeetingUrl(event))
      default:
        return events
    }
  }

  const getEventsForDate = (events: CalendarEvent[], date: Date) => {
    const startOfSelectedDay = startOfDay(date)
    const endOfSelectedDay = endOfDay(date)
    
    return events.filter(event => {
      const eventStart = parseISO(event.start_time)
      return eventStart >= startOfSelectedDay && eventStart <= endOfSelectedDay
    })
  }

  const getEventDates = (events: CalendarEvent[]) =>
    events.map(event => parseISO(event.start_time))

  const hasActiveIntegration = state.integrations.some(i => i.is_active)

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading calendar...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your calendar integrations and view upcoming meetings
          </p>
        </div>
        <div className="flex gap-2">
          {hasActiveIntegration && (
            <Button
              onClick={handleSyncCalendar}
              disabled={state.syncing}
              variant="outline"
            >
              {state.syncing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Now
            </Button>
          )}
          <Button onClick={handleConnectCalendar} disabled={state.connecting}>
            {state.connecting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Connect Calendar
          </Button>
        </div>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Calendar Integrations
          </CardTitle>
          <CardDescription>
            Manage your connected calendar accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.integrations.length === 0 ? (
            <div className="text-center py-8">
              <CalendarLucide className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Calendar Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Google Calendar to start syncing meetings and events
              </p>
              <Button onClick={handleConnectCalendar} disabled={state.connecting}>
                {state.connecting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Connect Google Calendar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {integration.provider === 'google' ? 'Google Calendar' : integration.provider}
                        </span>
                        {integration.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Disconnected
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {integration.external_account_email && (
                          <span>{integration.external_account_email}</span>
                        )}
                        {integration.last_sync && (
                          <span className="ml-2">
                            Last sync: {format(parseISO(integration.last_sync), 'MMM d, yyyy h:mm a')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {integration.is_active && (
                      <Button
                        onClick={handleSyncCalendar}
                        disabled={state.syncing}
                        variant="outline"
                        size="sm"
                      >
                        {state.syncing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDisconnectCalendar(integration.id)}
                      variant="outline"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {state.stats && hasActiveIntegration && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{state.stats.total_events}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{state.stats.upcoming_events}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{state.stats.events_with_meetings}</p>
                  <p className="text-sm text-muted-foreground">With Meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{state.stats.active_integrations}</p>
                  <p className="text-sm text-muted-foreground">Integrations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!hasActiveIntegration ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your Google Calendar above to view your meetings and events here.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Widget */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={state.selectedDate}
                onSelect={(date) => date && setState(prev => ({ ...prev, selectedDate: date }))}
                modifiers={{ 
                  hasEvent: getEventDates(state.events),
                  today: new Date()
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    borderRadius: "6px",
                  },
                  today: {
                    backgroundColor: "hsl(var(--accent))",
                    color: "hsl(var(--accent-foreground))",
                  }
                }}
                className="rounded-md border"
              />
              
              {/* Selected Date Events */}
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">
                  {format(state.selectedDate, 'EEEE, MMMM d')}
                </h4>
                <ScrollArea className="h-32">
                  <EventsList 
                    events={getEventsForDate(state.events, state.selectedDate)} 
                    compact={true}
                  />
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Events</CardTitle>
              <CardDescription>Your calendar events and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={state.activeTab} 
                onValueChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
              >
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="this-week">This Week</TabsTrigger>
                  <TabsTrigger value="with-meetings">Meetings</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                {["upcoming", "today", "this-week", "with-meetings", "all"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <ScrollArea className="h-96">
                      <EventsList events={filterEvents(state.events, tab)} />
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Events List Component
interface EventsListProps {
  events: CalendarEvent[]
  compact?: boolean
}

function EventsList({ events, compact = false }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No events found</p>
      </div>
    )
  }

  return (
    <div className={`space-y-${compact ? '2' : '3'}`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} compact={compact} />
      ))}
    </div>
  )
}

// Event Card Component
interface EventCardProps {
  event: CalendarEvent
  compact?: boolean
}

function EventCard({ event, compact = false }: EventCardProps) {
  const startTime = parseISO(event.start_time)
  const endTime = parseISO(event.end_time)
  const meetingUrl = calendarAPI.getMeetingUrl(event)
  
  const formatEventDate = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "EEE, MMM d")
  }

  const formatTimeRange = (start: Date, end: Date) => {
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
  }

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'google_meet':
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Google Meet</Badge>
      case 'zoom':
        return <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">Zoom</Badge>
      case 'microsoft_teams':
        return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">Teams</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Calendar</Badge>
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{event.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatTimeRange(startTime, endTime)}
          </p>
        </div>
        {meetingUrl && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => window.open(meetingUrl, "_blank")}
          >
            <Video className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{event.title}</h3>
            {getPlatformBadge(event.platform)}
            {event.status && (
              <Badge 
                variant={event.status === 'confirmed' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {event.status}
              </Badge>
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatEventDate(startTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRange(startTime, endTime)}</span>
              <span className="text-xs">({event.duration_minutes} min)</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees.length} attendees</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {meetingUrl && (
            <Button
              size="sm"
              onClick={() => window.open(meetingUrl, "_blank")}
              className="whitespace-nowrap"
            >
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}