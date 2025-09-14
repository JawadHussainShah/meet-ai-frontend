"use client"

import { useCallback } from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Mic, MicOff, Users, Clock, AlertCircle, Volume2, MessageSquare, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// Define interfaces locally since we can't import from lib/websocket
interface TranscriptSegment {
  id: number
  text: string
  start_time: string
  end_time?: string
  confidence: number
  speaker: string
  language: string
  is_question?: boolean
  is_action_item?: boolean
  sentiment?: string
}

interface WebSocketMessage {
  type: string
  session_id?: number
  message?: string
  timestamp?: number
  segment?: TranscriptSegment
  segments?: TranscriptSegment[]
  status?: string
  progress?: number
  stats?: any
  [key: string]: any
}

interface TranscriptionSession {
  id: number
  meeting_title: string
  meeting_url: string
  status: string
  progress_percentage?: number
  status_message?: string
  created_at: string
  updated_at: string
}

interface RealtimeTranscriptionProps {
  session: TranscriptionSession
  onSessionUpdate?: (session: TranscriptionSession) => void
}

// WebSocket message types
const WS_MESSAGE_TYPES = {
  PING: "ping",
  PONG: "pong",
  CONNECTION_ESTABLISHED: "connection_established",
  STATUS_UPDATE: "status_update",
  TRANSCRIPT_SEGMENT: "transcript_segment",
  TRANSCRIPT_SEGMENTS: "transcript_segments",
  SESSION_STATS: "session_stats",
  GET_STATUS: "get_status",
  GET_SEGMENTS: "get_segments",
  SUBSCRIBE_UPDATES: "subscribe_updates",
  SUBSCRIPTION_CONFIRMED: "subscription_confirmed",
  ERROR: "error",
} as const

// Custom WebSocket hook
function useWebSocket(sessionId: number | null) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (!sessionId) {
      console.warn("Cannot connect WebSocket: sessionId is null")
      return
    }

    try {
      // Determine WebSocket URL based on current location
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const host = window.location.host
      const wsUrl = `${protocol}//${host}/api/v1/ws/transcription/${sessionId}`

      console.log("Connecting to WebSocket:", wsUrl)

      const newSocket = new WebSocket(wsUrl)

      newSocket.onopen = () => {
        console.log("WebSocket connected")
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0

        // Send initial ping
        newSocket.send(JSON.stringify({ type: "ping" }))
      }

      newSocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log("WebSocket message received:", message.type)
          setLastMessage(message)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      newSocket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason)
        setIsConnected(false)
        setSocket(null)

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
          console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, delay)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError("Failed to reconnect after multiple attempts")
        }
      }

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error)
        setConnectionError("WebSocket connection error")
      }

      setSocket(newSocket)
    } catch (error) {
      console.error("Error creating WebSocket:", error)
      setConnectionError("Failed to create WebSocket connection")
    }
  }, [sessionId])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (socket) {
      socket.close(1000, "Manual disconnect")
    }

    setSocket(null)
    setIsConnected(false)
    setConnectionError(null)
    reconnectAttemptsRef.current = 0
  }, [socket])

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected) {
        try {
          socket.send(JSON.stringify(message))
        } catch (error) {
          console.error("Error sending WebSocket message:", error)
        }
      } else {
        console.warn("Cannot send message: WebSocket not connected")
      }
    },
    [socket, isConnected],
  )

  // Auto-connect when sessionId changes
  useEffect(() => {
    if (sessionId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [sessionId, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      disconnect()
    }
  }, [disconnect])

  return {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    connectionError,
  }
}

// Utility functions
function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "recording":
    case "active":
      return "green"
    case "processing":
    case "transcribing":
      return "yellow"
    case "completed":
    case "finished":
      return "blue"
    case "failed":
    case "error":
      return "red"
    default:
      return "gray"
  }
}

function getStatusLabel(status: string) {
  switch (status?.toLowerCase()) {
    case "recording":
      return "Recording"
    case "processing":
      return "Processing"
    case "transcribing":
      return "Transcribing"
    case "completed":
      return "Completed"
    case "failed":
      return "Failed"
    case "active":
      return "Active"
    default:
      return status || "Unknown"
  }
}

export function RealtimeTranscription({ session, onSessionUpdate }: RealtimeTranscriptionProps) {
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [currentStatus, setCurrentStatus] = useState(session.status)
  const [progress, setProgress] = useState(session.progress_percentage || 0)
  const [statusMessage, setStatusMessage] = useState(session.status_message || "")
  const [isRecording, setIsRecording] = useState(false)
  const [sessionStats, setSessionStats] = useState<any>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { isConnected, lastMessage, sendMessage, connectionError } = useWebSocket(session.id)

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    console.log("Received WebSocket message:", lastMessage.type)

    switch (lastMessage.type) {
      case WS_MESSAGE_TYPES.CONNECTION_ESTABLISHED:
        console.log("WebSocket connection established")
        // Request current status and segments
        sendMessage({ type: WS_MESSAGE_TYPES.GET_STATUS })
        sendMessage({ type: WS_MESSAGE_TYPES.GET_SEGMENTS })
        sendMessage({ type: WS_MESSAGE_TYPES.SUBSCRIBE_UPDATES })
        break

      case WS_MESSAGE_TYPES.STATUS_UPDATE:
        setCurrentStatus(lastMessage.status || session.status)
        setProgress(lastMessage.progress || 0)
        setStatusMessage(lastMessage.message || "")
        setIsRecording(lastMessage.status === "recording" || lastMessage.status === "active")

        if (onSessionUpdate) {
          onSessionUpdate({
            ...session,
            status: lastMessage.status || session.status,
            progress_percentage: lastMessage.progress,
            status_message: lastMessage.message,
          })
        }
        break

      case WS_MESSAGE_TYPES.TRANSCRIPT_SEGMENT:
        if (lastMessage.segment) {
          setSegments((prev) => {
            // Check if segment already exists to avoid duplicates
            const exists = prev.some((seg) => seg.id === lastMessage.segment!.id)
            if (exists) return prev

            return [...prev, lastMessage.segment!]
          })

          // Auto-scroll to bottom
          setTimeout(() => {
            if (scrollAreaRef.current) {
              scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
            }
          }, 100)
        }
        break

      case WS_MESSAGE_TYPES.TRANSCRIPT_SEGMENTS:
        if (lastMessage.segments) {
          setSegments(lastMessage.segments)
        }
        break

      case WS_MESSAGE_TYPES.SESSION_STATS:
        if (lastMessage.stats) {
          setSessionStats(lastMessage.stats)
        }
        break

      case WS_MESSAGE_TYPES.PONG:
        // Handle pong response
        console.log("Received pong from server")
        break

      case WS_MESSAGE_TYPES.ERROR:
        console.error("WebSocket error:", lastMessage.message)
        break

      default:
        console.log("Unhandled message type:", lastMessage.type)
    }
  }, [lastMessage, sendMessage, session, onSessionUpdate])

  // Auto-scroll to bottom when new segments arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [segments])

  // Simulate audio level for recording sessions
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 200)
    } else {
      setAudioLevel(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Send periodic pings to keep connection alive
  useEffect(() => {
    if (!isConnected) return

    const pingInterval = setInterval(() => {
      sendMessage({ type: WS_MESSAGE_TYPES.PING })
    }, 30000) // Ping every 30 seconds

    return () => clearInterval(pingInterval)
  }, [isConnected, sendMessage])

  const getConnectionStatus = () => {
    if (connectionError) {
      return { status: "error", message: connectionError, color: "red" }
    }
    if (isConnected) {
      return { status: "connected", message: "Connected", color: "green" }
    }
    return { status: "disconnected", message: "Disconnected", color: "yellow" }
  }

  const connectionStatus = getConnectionStatus()

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString()
    } catch {
      return timestamp
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getSegmentIcon = (speaker: string) => {
    return speaker === "Unknown" ? <Users className="h-4 w-4" /> : <Mic className="h-4 w-4" />
  }

  const getTotalSpeakers = () => {
    const speakers = new Set(segments.map((seg) => seg.speaker).filter((s) => s !== "Unknown"))
    return speakers.size
  }

  const getActionItemsCount = () => {
    return segments.filter((seg) => seg.is_action_item).length
  }

  const getQuestionsCount = () => {
    return segments.filter((seg) => seg.is_question).length
  }

  return (
    <div className="space-y-6">
      {/* Session Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isRecording ? (
                <Mic className="h-5 w-5 text-red-500 animate-pulse" />
              ) : (
                <MicOff className="h-5 w-5 text-gray-400" />
              )}
              {session.meeting_title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  connectionStatus.color === "green" && "border-green-500 text-green-700 bg-green-50",
                  connectionStatus.color === "yellow" && "border-yellow-500 text-yellow-700 bg-yellow-50",
                  connectionStatus.color === "red" && "border-red-500 text-red-700 bg-red-50",
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mr-1",
                    connectionStatus.color === "green" && "bg-green-500",
                    connectionStatus.color === "yellow" && "bg-yellow-500",
                    connectionStatus.color === "red" && "bg-red-500",
                  )}
                />
                {connectionStatus.message}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  getStatusColor(currentStatus) === "green" && "bg-green-100 text-green-800",
                  getStatusColor(currentStatus) === "yellow" && "bg-yellow-100 text-yellow-800",
                  getStatusColor(currentStatus) === "red" && "bg-red-100 text-red-800",
                  getStatusColor(currentStatus) === "blue" && "bg-blue-100 text-blue-800",
                )}
              >
                {getStatusLabel(currentStatus)}
              </Badge>
            </div>
          </div>
          {statusMessage && <p className="text-sm text-muted-foreground mt-2">{statusMessage}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Audio Level</span>
                <span className="font-medium">{Math.round(audioLevel)}%</span>
              </div>
              <Progress value={audioLevel} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-lg font-bold">
                  {sessionStats?.duration_seconds ? formatDuration(sessionStats.duration_seconds) : "0:00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Speakers</p>
                <p className="text-lg font-bold">{getTotalSpeakers()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Segments</p>
                <p className="text-lg font-bold">{segments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Action Items</p>
                <p className="text-lg font-bold">{getActionItemsCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Transcript */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Transcript
              {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendMessage({ type: WS_MESSAGE_TYPES.GET_SEGMENTS })}
                disabled={!isConnected}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full" ref={scrollAreaRef}>
            <div className="space-y-4">
              {segments.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{isRecording ? "Listening for speech..." : "No transcript segments available yet"}</p>
                    {!isConnected && <p className="text-sm text-red-500 mt-1">WebSocket disconnected</p>}
                  </div>
                </div>
              ) : (
                segments.map((segment, index) => (
                  <div key={segment.id || index} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimestamp(segment.start_time)}</span>
                      {segment.speaker && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span className="font-medium">{segment.speaker}</span>
                        </>
                      )}
                      {segment.confidence && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span>Confidence: {Math.round(segment.confidence * 100)}%</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="text-sm leading-relaxed flex-1">{segment.text}</p>
                      <div className="flex gap-1">
                        {segment.is_question && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            Question
                          </Badge>
                        )}
                        {segment.is_action_item && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                            Action
                          </Badge>
                        )}
                        {segment.sentiment && segment.sentiment !== "neutral" && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            {segment.sentiment}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {index < segments.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Connection Error */}
      {connectionError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Connection Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{connectionError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RealtimeTranscription