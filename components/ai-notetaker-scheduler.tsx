"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Users, Video, Play, Square, AlertCircle, CheckCircle, Loader2, ExternalLink, Mic, MicOff, FileText } from 'lucide-react'
import { calendarAPI, type CalendarEvent } from "@/lib/calendar-api"
import { transcriptionAPI, type TranscriptionSession, TranscriptionStatus } from "@/lib/transcription-api"
import { useToast } from "@/hooks/use-toast"
import { format, isAfter, isBefore, parseISO } from "date-fns"

interface SchedulerProps {
  onSessionCreated?: (session: TranscriptionSession) => void
  onSessionUpdated?: (session: TranscriptionSession) => void
}

export default function AINotetakerScheduler({ onSessionCreated, onSessionUpdated }: SchedulerProps) {
  const [upcomingMeetings, setUpcomingMeetings] = useState<CalendarEvent[]>([])
  const [activeSessions, setActiveSessions] = useState<TranscriptionSession[]>([])
  const [completedSessions, setCompletedSessions] = useState<TranscriptionSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [schedulingEventId, setSchedulingEventId] = useState<number | null>(null)
  const [stoppingSessionId, setStoppingSessionId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
    
    // Refresh data every 10 seconds for active sessions
    const interval = setInterval(() => {
      if (activeSessions.length > 0) {
        loadActiveSessions()
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [activeSessions.length])

  const loadData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([
        loadUpcomingMeetings(),
        loadActiveSessions(),
        loadCompletedSessions()
      ])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load meeting data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUpcomingMeetings = async () => {
    try {
      const events = await calendarAPI.getEvents({
        start_date: format(new Date(), 'yyyy-MM-dd'),
        limit: 50
      })
      
      // Filter for upcoming events with meeting URLs
      const upcoming = events.filter(event => {
        const eventStart = parseISO(event.start_time)
        const now = new Date()
        return isAfter(eventStart, now) && calendarAPI.hasMeetingUrl(event)
      })
      
      setUpcomingMeetings(upcoming)
    } catch (error) {
      console.error("Error loading upcoming meetings:", error)
    }
  }

  const loadActiveSessions = async () => {
    try {
      const sessions = await transcriptionAPI.getActiveSessions()
      setActiveSessions(sessions)
    } catch (error) {
      console.error("Error loading active sessions:", error)
    }
  }

  const loadCompletedSessions = async () => {
    try {
      const sessions = await transcriptionAPI.getSessions({
        limit: 10,
        status_filter: TranscriptionStatus.COMPLETED
      })
      setCompletedSessions(sessions)
    } catch (error) {
      console.error("Error loading completed sessions:", error)
    }
  }

  const handleScheduleNotetaker = async (event: CalendarEvent) => {
    try {
      setSchedulingEventId(event.id)
      
      const session = await transcriptionAPI.scheduleFromCalendarEvent(event.id, {
        auto_join: true,
        generate_summary: true,
        extract_action_items: true
      })
      
      toast({
        title: "AI Notetaker Scheduled",
        description: `AI notetaker will join "${event.title}" automatically`,
      })
      
      onSessionCreated?.(session)
      loadData()
    } catch (error) {
      console.error("Error scheduling notetaker:", error)
      toast({
        title: "Scheduling Failed",
        description: error instanceof Error ? error.message : "Failed to schedule AI notetaker",
        variant: "destructive",
      })
    } finally {
      setSchedulingEventId(null)
    }
  }

  const handleStopSession = async (session: TranscriptionSession) => {
    try {
      setStoppingSessionId(session.id)
      
      await transcriptionAPI.stopTranscription(session.id)
      
      toast({
        title: "Session Stopped",
        description: "AI notetaker has been stopped and transcription is being processed",
      })
      
      onSessionUpdated?.(session)
      loadData()
    } catch (error) {
      console.error("Error stopping session:", error)
      toast({
        title: "Error",
        description: "Failed to stop transcription session",
        variant: "destructive",
      })
    } finally {
      setStoppingSessionId(null)
    }
  }

  const handleStartNow = async (session: TranscriptionSession) => {
    try {
      await transcriptionAPI.startTranscriptionNow(session.id)
      
      toast({
        title: "Transcription Started",
        description: "AI notetaker is joining the meeting now",
      })
      
      loadData()
    } catch (error) {
      console.error("Error starting transcription:", error)
      toast({
        title: "Error",
        description: "Failed to start transcription",
        variant: "destructive",
      })
    }
  }

  const getSessionForEvent = (eventId: number) => {
    return activeSessions.find(session => session.calendar_event_id === eventId)
  }

  const isEventHappeningNow = (event: CalendarEvent) => {
    const now = new Date()
    const start = parseISO(event.start_time)
    const end = parseISO(event.end_time)
    return isAfter(now, start) && isBefore(now, end)
  }

  const canScheduleEvent = (event: CalendarEvent) => {
    const existingSession = getSessionForEvent(event.id)
    return !existingSession && calendarAPI.hasMeetingUrl(event)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading meetings...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            AI Notetaker
          </CardTitle>
          <CardDescription>
            Schedule AI notetaker to automatically join your meetings and generate transcriptions
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Active Sessions ({activeSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSessions.map((session) => (
              <ActiveSessionCard
                key={session.id}
                session={session}
                onStop={() => handleStopSession(session)}
                onStartNow={() => handleStartNow(session)}
                isStoppingSession={stoppingSessionId === session.id}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
          <CardDescription>
            Meetings with video links that can be transcribed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming meetings with video links found</p>
              <p className="text-sm text-gray-500 mt-2">
                Make sure your calendar is connected and you have meetings scheduled
              </p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {upcomingMeetings.map((event) => (
                  <UpcomingMeetingCard
                    key={event.id}
                    event={event}
                    existingSession={getSessionForEvent(event.id)}
                    onSchedule={() => handleScheduleNotetaker(event)}
                    isScheduling={schedulingEventId === event.id}
                    canSchedule={canScheduleEvent(event)}
                    isHappeningNow={isEventHappeningNow(event)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Recent Completed Sessions */}
      {completedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Transcriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {completedSessions.map((session) => (
                  <CompletedSessionCard key={session.id} session={session} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Active Session Card Component
interface ActiveSessionCardProps {
  session: TranscriptionSession
  onStop: () => void
  onStartNow: () => void
  isStoppingSession: boolean
}

function ActiveSessionCard({ session, onStop, onStartNow, isStoppingSession }: ActiveSessionCardProps) {
  const getStatusIcon = () => {
    switch (session.status) {
      case TranscriptionStatus.RECORDING:
        return <Mic className="h-4 w-4 text-red-500" />
      case TranscriptionStatus.PROCESSING:
        return <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const canStop = [TranscriptionStatus.RECORDING, TranscriptionStatus.JOINING, TranscriptionStatus.STARTING].includes(session.status as TranscriptionStatus)
  const canStartNow = session.status === TranscriptionStatus.SCHEDULED

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium">{session.meeting_title}</p>
            <p className="text-sm text-gray-600">
              {session.status_message || session.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={transcriptionAPI.getStatusColor(session.status as TranscriptionStatus)}>
            {session.status}
          </Badge>
          {canStartNow && (
            <Button onClick={onStartNow} size="sm" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Start Now
            </Button>
          )}
          {canStop && (
            <Button
              onClick={onStop}
              disabled={isStoppingSession}
              variant="outline"
              size="sm"
            >
              {isStoppingSession ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              Stop
            </Button>
          )}
        </div>
      </div>
      
      {session.progress_percentage !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{session.progress_percentage}%</span>
          </div>
          <Progress value={session.progress_percentage} className="h-2" />
        </div>
      )}
      
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            Started: {session.actual_start 
              ? format(parseISO(session.actual_start), 'h:mm a')
              : 'Not started'
            }
          </span>
        </div>
        {session.duration_minutes && (
          <div className="flex items-center gap-2">
            <span>Duration: {transcriptionAPI.formatDuration(session.duration_minutes)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Upcoming Meeting Card Component
interface UpcomingMeetingCardProps {
  event: CalendarEvent
  existingSession?: TranscriptionSession
  onSchedule: () => void
  isScheduling: boolean
  canSchedule: boolean
  isHappeningNow: boolean
}

function UpcomingMeetingCard({ 
  event, 
  existingSession, 
  onSchedule, 
  isScheduling, 
  canSchedule,
  isHappeningNow 
}: UpcomingMeetingCardProps) {
  const meetingUrl = calendarAPI.getMeetingUrl(event)
  
  const getPlatformBadge = () => {
    if (meetingUrl?.includes('meet.google.com')) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700">Google Meet</Badge>
    } else if (meetingUrl?.includes('zoom.us')) {
      return <Badge variant="outline" className="bg-purple-50 text-purple-700">Zoom</Badge>
    } else if (meetingUrl?.includes('teams.microsoft.com')) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700">Teams</Badge>
    }
    return <Badge variant="outline">Meeting</Badge>
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">{event.title}</h3>
            {getPlatformBadge()}
            {isHappeningNow && (
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                Live Now
              </Badge>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {format(parseISO(event.start_time), 'MMM d, h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}
              </span>
              <span className="text-xs">({event.duration_minutes} min)</span>
            </div>
            
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees.length} attendees</span>
              </div>
            )}
            
            {meetingUrl && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <a 
                  href={meetingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  Join Meeting
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          {existingSession ? (
            <Badge className={transcriptionAPI.getStatusColor(existingSession.status as TranscriptionStatus)}>
              <CheckCircle className="h-3 w-3 mr-1" />
              {existingSession.status}
            </Badge>
          ) : canSchedule ? (
            <Button
              onClick={onSchedule}
              disabled={isScheduling}
              size="sm"
            >
              {isScheduling ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Schedule AI Notetaker
            </Button>
          ) : !meetingUrl ? (
            <Alert className="w-64">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                No meeting link found
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// Completed Session Card Component
interface CompletedSessionCardProps {
  session: TranscriptionSession
}

function CompletedSessionCard({ session }: CompletedSessionCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileText className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-sm">{session.meeting_title}</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>{format(parseISO(session.created_at), 'MMM d, h:mm a')}</span>
            {session.duration_minutes && (
              <span>{transcriptionAPI.formatDuration(session.duration_minutes)}</span>
            )}
            {session.action_items && (
              <span>{session.action_items.length} action items</span>
            )}
          </div>
        </div>
      </div>
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    </div>
  )
}