import { apiClient } from "./api"

export interface CalendarIntegration {
  id: number
  user_id: number
  provider: string
  external_account_email?: string
  is_active: boolean
  last_sync?: string
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: number
  user_id: number
  integration_id: number
  external_id: string
  google_event_id?: string
  title: string
  description?: string
  start_time: string
  end_time: string
  duration_minutes: number
  location?: string
  meet_url?: string
  meeting_url?: string
  platform: string
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus?: string
  }>
  status: string
  created_at: string
  updated_at: string
}

export interface CalendarSyncResponse {
  synced_events: number
  updated_events: number
  total_events: number
  last_sync: string
  errors: string[]
}

export interface CalendarStats {
  total_integrations: number
  active_integrations: number
  total_events: number
  upcoming_events: number
  events_with_meetings: number
  last_sync?: string
}

export interface MeetingInfo {
  event_id: number
  title: string
  start_time: string
  end_time: string
  meeting_url?: string
  meeting_platform: string
  attendees: string[]
  location?: string
  description?: string
  can_transcribe: boolean
  transcription_requirements: Record<string, any>
}

export interface IntegrationHealth {
  integration_id: number
  provider: string
  is_healthy: boolean
  last_successful_sync?: string
  error_count: number
  last_error?: string
  token_expires_at?: string
  needs_reauth: boolean
}

class CalendarAPI {
  // Get calendar auth URL
  async getAuthUrl(): Promise<{ auth_url: string; state?: string }> {
    return apiClient.request<{ auth_url: string; state?: string }>("/calendar/auth-url")
  }

  // Handle OAuth callback
  async handleCallback(
    code: string,
    state?: string
  ): Promise<{ success: boolean; integration_id?: number; message: string }> {
    return apiClient.request<{ success: boolean; integration_id?: number; message: string }>(
      "/calendar/callback",
      {
        method: "POST",
        body: JSON.stringify({
          code,
          state,
          provider: "google",
        }),
      }
    )
  }

  // Get calendar integrations
  async getIntegrations(): Promise<CalendarIntegration[]> {
    return apiClient.request<CalendarIntegration[]>("/calendar/integrations")
  }

  // Disconnect calendar integration
  async disconnectIntegration(integrationId: number): Promise<{ message: string }> {
    return apiClient.request<{ message: string }>(`/calendar/integrations/${integrationId}`, {
      method: "DELETE",
    })
  }

  // Sync calendar events
  async syncCalendar(options?: {
    start_date?: string
    end_date?: string
    force_refresh?: boolean
  }): Promise<CalendarSyncResponse> {
    return apiClient.request<CalendarSyncResponse>("/calendar/sync", {
      method: "POST",
      body: JSON.stringify(options || {}),
    })
  }

  // Get calendar events
  async getEvents(options?: {
    start_date?: string
    end_date?: string
    limit?: number
    offset?: number
  }): Promise<CalendarEvent[]> {
    const params = new URLSearchParams()
    if (options?.start_date) params.append("start_date", options.start_date)
    if (options?.end_date) params.append("end_date", options.end_date)
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.offset) params.append("offset", options.offset.toString())

    const query = params.toString()
    return apiClient.request<CalendarEvent[]>(
      query ? `/calendar/events?${query}` : "/calendar/events"
    )
  }

  // Get specific calendar event
  async getEvent(eventId: number): Promise<CalendarEvent> {
    return apiClient.request<CalendarEvent>(`/calendar/events/${eventId}`)
  }

  // Get meeting info for transcription
  async getMeetingInfo(eventId: number): Promise<MeetingInfo> {
    return apiClient.request<MeetingInfo>(`/calendar/events/${eventId}/meeting-info`)
  }

  // Get calendar statistics
  async getStats(): Promise<CalendarStats> {
    return apiClient.request<CalendarStats>("/calendar/stats")
  }

  // Check integration health
  async checkIntegrationHealth(integrationId: number): Promise<IntegrationHealth> {
    return apiClient.request<IntegrationHealth>(
      `/calendar/integrations/${integrationId}/health`
    )
  }

  // Helper methods
  formatDate(date: Date): string {
    return date.toISOString().split("T")[0]
  }

  parseDateTime(dateTimeString: string): Date {
    return new Date(dateTimeString)
  }

  isUpcoming(event: CalendarEvent): boolean {
    return new Date(event.start_time) > new Date()
  }

  hasMeetingUrl(event: CalendarEvent): boolean {
    return !!(event.meet_url || event.meeting_url)
  }

  getMeetingUrl(event: CalendarEvent): string | null {
    return event.meet_url || event.meeting_url || null
  }

  getDurationHours(event: CalendarEvent): number {
    return Math.round((event.duration_minutes / 60) * 100) / 100
  }

  getEventsByDateRange(
    events: CalendarEvent[],
    startDate: Date,
    endDate: Date
  ): CalendarEvent[] {
    return events.filter((event) => {
      const eventStart = new Date(event.start_time)
      return eventStart >= startDate && eventStart <= endDate
    })
  }

  getUpcomingEvents(events: CalendarEvent[], limit: number = 10): CalendarEvent[] {
    const now = new Date()
    return events
      .filter((event) => new Date(event.start_time) > now)
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )
      .slice(0, limit)
  }

  getEventsWithMeetings(events: CalendarEvent[]): CalendarEvent[] {
    return events.filter((event) => this.hasMeetingUrl(event))
  }

  searchEvents(events: CalendarEvent[], query: string): CalendarEvent[] {
    const searchTerm = query.toLowerCase()
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm) ||
        (event.description &&
          event.description.toLowerCase().includes(searchTerm)) ||
        (event.location &&
          event.location.toLowerCase().includes(searchTerm))
    )
  }
}

export const calendarAPI = new CalendarAPI()