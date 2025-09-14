export interface TranscriptSegment {
  id?: number
  session_id: number
  start_time: number
  end_time: number
  duration: number
  text: string
  speaker?: string
  confidence?: number
  sentiment?: string
  sentiment_score?: number
  is_question: boolean
  is_action_item: boolean
  language: string
  processing_model?: string
  created_at?: string
}

export interface WebSocketMessage {
  type: string
  session_id?: number
  segment?: TranscriptSegment
  status?: string
  message?: string
  progress?: number
  stats?: any
  timestamp?: string
}

export class TranscriptionWebSocket {
  private ws: WebSocket | null = null
  private sessionId: number
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false

  // Event handlers
  private onTranscriptSegmentHandler?: (segment: TranscriptSegment) => void
  private onStatusUpdateHandler?: (status: { status: string; message?: string; progress?: number }) => void
  private onSessionStatsHandler?: (stats: any) => void
  private onErrorHandler?: (error: Error) => void
  private onConnectHandler?: () => void
  private onDisconnectHandler?: () => void

  constructor(sessionId: number) {
    this.sessionId = sessionId
  }

  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const wsUrl = `${protocol}//${window.location.host}/api/v1/ws/transcription/${this.sessionId}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log(`WebSocket connected for session ${this.sessionId}`)
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.onConnectHandler?.()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
          this.onErrorHandler?.(new Error("Failed to parse WebSocket message"))
        }
      }

      this.ws.onclose = (event) => {
        console.log(`WebSocket closed for session ${this.sessionId}:`, event.code, event.reason)
        this.isConnecting = false
        this.onDisconnectHandler?.()

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error(`WebSocket error for session ${this.sessionId}:`, error)
        this.isConnecting = false
        this.onErrorHandler?.(new Error("WebSocket connection error"))
      }

      // Wait for connection to open
      await new Promise<void>((resolve, reject) => {
        if (!this.ws) {
          reject(new Error("WebSocket not initialized"))
          return
        }

        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"))
        }, 10000)

        this.ws.onopen = () => {
          clearTimeout(timeout)
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.onConnectHandler?.()
          resolve()
        }

        this.ws.onerror = () => {
          clearTimeout(timeout)
          this.isConnecting = false
          reject(new Error("WebSocket connection failed"))
        }
      })
    } catch (error) {
      this.isConnecting = false
      throw error
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`)

    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch((error) => {
          console.error("Reconnect failed:", error)
        })
      }
    }, delay)
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "transcript_segment":
        if (message.segment) {
          this.onTranscriptSegmentHandler?.(message.segment)
        }
        break

      case "status_update":
        this.onStatusUpdateHandler?.({
          status: message.status || "",
          message: message.message,
          progress: message.progress,
        })
        break

      case "session_stats":
        if (message.stats) {
          this.onSessionStatsHandler?.(message.stats)
        }
        break

      case "connection_established":
        console.log("WebSocket connection established:", message.message)
        break

      case "pong":
        // Handle ping response
        break

      case "error":
        console.error("WebSocket error message:", message.message)
        this.onErrorHandler?.(new Error(message.message || "Unknown WebSocket error"))
        break

      default:
        console.log("Unknown WebSocket message type:", message.type)
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "Client disconnect")
      this.ws = null
    }
  }

  ping(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "ping",
          timestamp: new Date().toISOString(),
        }),
      )
    }
  }

  requestStats(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "request_stats",
        }),
      )
    }
  }

  // Event handler setters
  onTranscriptSegment(handler: (segment: TranscriptSegment) => void): void {
    this.onTranscriptSegmentHandler = handler
  }

  onStatusUpdate(handler: (status: { status: string; message?: string; progress?: number }) => void): void {
    this.onStatusUpdateHandler = handler
  }

  onSessionStats(handler: (stats: any) => void): void {
    this.onSessionStatsHandler = handler
  }

  onError(handler: (error: Error) => void): void {
    this.onErrorHandler = handler
  }

  onConnect(handler: () => void): void {
    this.onConnectHandler = handler
  }

  onDisconnect(handler: () => void): void {
    this.onDisconnectHandler = handler
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}