import { apiClient } from "./api"

export interface TranscriptionSession {
  id: number
  user_id: number
  calendar_event_id?: number
  meeting_url: string
  meeting_title: string
  scheduled_start: string
  scheduled_end: string
  actual_start?: string
  actual_end?: string
  status: TranscriptionStatus
  status_message?: string
  progress_percentage?: number
  transcript?: string
  summary?: string
  action_items?: Array<{
    text: string
    assignee?: string
    due_date?: string
    priority?: string
  }>
  key_points?: string[]
  sentiment_analysis?: {
    overall_sentiment: string
    sentiment_score: number
    emotions?: string[]
  }
  speakers?: string[]
  duration_minutes?: number
  participant_count?: number
  audio_quality?: string
  processing_time?: number
  created_at: string
  updated_at?: string
}

export enum TranscriptionStatus {
  SCHEDULED = "scheduled",
  STARTING = "starting",
  JOINING = "joining",
  RECORDING = "recording",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface TranscriptionSessionCreate {
  calendar_event_id?: number
  meeting_url: string
  meeting_title: string
  scheduled_start: string
  scheduled_end: string
}

export interface TranscriptionSessionUpdate {
  meeting_title?: string
  scheduled_start?: string
  scheduled_end?: string
  status?: TranscriptionStatus
  status_message?: string
}

export interface TranscriptSegment {
  id: number
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
  created_at: string
}

class TranscriptionAPI {
  // Schedule new transcription
  async scheduleTranscription(data: TranscriptionSessionCreate): Promise<TranscriptionSession> {
    return apiClient.request<TranscriptionSession>("/transcription/schedule", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Schedule transcription from calendar event
  async scheduleFromCalendarEvent(
    eventId: number,
    options?: {
      auto_join?: boolean
      generate_summary?: boolean
      extract_action_items?: boolean
    }
  ): Promise<TranscriptionSession> {
    const params = new URLSearchParams()
    if (options?.auto_join !== undefined) params.append("auto_join", options.auto_join.toString())
    if (options?.generate_summary !== undefined) params.append("generate_summary", options.generate_summary.toString())
    if (options?.extract_action_items !== undefined) params.append("extract_action_items", options.extract_action_items.toString())

    return apiClient.request<TranscriptionSession>(
      `/transcription/from-calendar-event/${eventId}?${params.toString()}`,
      { method: "POST" }
    )
  }

  // Get all transcription sessions
  async getSessions(options?: {
    skip?: number
    limit?: number
    status_filter?: TranscriptionStatus
  }): Promise<TranscriptionSession[]> {
    const params = new URLSearchParams()
    if (options?.skip) params.append("skip", options.skip.toString())
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.status_filter) params.append("status_filter", options.status_filter)

    const query = params.toString()
    return apiClient.request<TranscriptionSession[]>(
      query ? `/transcription/sessions?${query}` : "/transcription/sessions"
    )
  }

  // Get active transcription sessions
  async getActiveSessions(): Promise<TranscriptionSession[]> {
    return apiClient.request<TranscriptionSession[]>("/transcription/sessions/active")
  }

  // Get specific transcription session
  async getSession(sessionId: number): Promise<TranscriptionSession> {
    return apiClient.request<TranscriptionSession>(`/transcription/sessions/${sessionId}`)
  }

  // Update transcription session
  async updateSession(sessionId: number, data: TranscriptionSessionUpdate): Promise<TranscriptionSession> {
    return apiClient.request<TranscriptionSession>(`/transcription/sessions/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Stop transcription session
  async stopTranscription(sessionId: number): Promise<{ message: string }> {
    return apiClient.request<{ message: string }>(`/transcription/sessions/${sessionId}/stop`, {
      method: "POST",
    })
  }

  // Cancel transcription session
  async cancelTranscription(sessionId: number): Promise<{ message: string }> {
    return apiClient.request<{ message: string }>(`/transcription/sessions/${sessionId}`, {
      method: "DELETE",
    })
  }

  // Start transcription immediately
  async startTranscriptionNow(sessionId: number): Promise<{ message: string }> {
    return apiClient.request<{ message: string }>(`/transcription/sessions/${sessionId}/start-now`, {
      method: "POST",
    })
  }

  // Get transcript segments
  async getTranscriptSegments(sessionId: number): Promise<TranscriptSegment[]> {
    return apiClient.request<TranscriptSegment[]>(`/transcription/sessions/${sessionId}/segments`)
  }

  // Export transcript
  async exportTranscript(sessionId: number, format: "txt" | "json" | "srt"): Promise<{ content: string }> {
    return apiClient.request<{ content: string }>(`/transcription/sessions/${sessionId}/export/${format}`)
  }

  // Helper methods
  isActive(session: TranscriptionSession): boolean {
    return [
      TranscriptionStatus.SCHEDULED,
      TranscriptionStatus.STARTING,
      TranscriptionStatus.JOINING,
      TranscriptionStatus.RECORDING,
      TranscriptionStatus.PROCESSING,
    ].includes(session.status)
  }

  isCompleted(session: TranscriptionSession): boolean {
    return session.status === TranscriptionStatus.COMPLETED
  }

  isFailed(session: TranscriptionSession): boolean {
    return session.status === TranscriptionStatus.FAILED
  }

  getStatusColor(status: TranscriptionStatus): string {
    switch (status) {
      case TranscriptionStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800"
      case TranscriptionStatus.STARTING:
      case TranscriptionStatus.JOINING:
        return "bg-yellow-100 text-yellow-800"
      case TranscriptionStatus.RECORDING:
        return "bg-red-100 text-red-800"
      case TranscriptionStatus.PROCESSING:
        return "bg-purple-100 text-purple-800"
      case TranscriptionStatus.COMPLETED:
        return "bg-green-100 text-green-800"
      case TranscriptionStatus.FAILED:
        return "bg-red-100 text-red-800"
      case TranscriptionStatus.CANCELLED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getStatusIcon(status: TranscriptionStatus): string {
    switch (status) {
      case TranscriptionStatus.SCHEDULED:
        return "clock"
      case TranscriptionStatus.STARTING:
      case TranscriptionStatus.JOINING:
        return "loader"
      case TranscriptionStatus.RECORDING:
        return "record"
      case TranscriptionStatus.PROCESSING:
        return "cpu"
      case TranscriptionStatus.COMPLETED:
        return "check-circle"
      case TranscriptionStatus.FAILED:
        return "x-circle"
      case TranscriptionStatus.CANCELLED:
        return "x"
      default:
        return "help-circle"
    }
  }

  formatDuration(minutes?: number): string {
    if (!minutes) return "N/A"
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  getProgressPercentage(session: TranscriptionSession): number {
    return session.progress_percentage || 0
  }

  hasTranscript(session: TranscriptionSession): boolean {
    return !!session.transcript?.length
  }

  hasActionItems(session: TranscriptionSession): boolean {
    return !!session.action_items?.length
  }

  getActionItemsCount(session: TranscriptionSession): number {
    return session.action_items?.length || 0
  }

  getSpeakersCount(session: TranscriptionSession): number {
    return session.speakers?.length || 0
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString()
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString()
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString()
  }
}

export const transcriptionAPI = new TranscriptionAPI()