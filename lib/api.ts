const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface ApiError {
  detail: string
  status_code?: number
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  full_name?: string
}

export interface TranscriptionSession {
  id: number
  meeting_url: string
  meeting_title: string
  scheduled_start: string
  scheduled_end?: string
  actual_start?: string
  actual_end?: string
  status: "scheduled" | "starting" | "joining" | "recording" | "processing" | "completed" | "failed"
  status_message?: string
  progress_percentage: number
  transcript?: string
  summary?: string
  action_items?: ActionItem[]
  key_points?: string[]
  sentiment_analysis?: SentimentAnalysis
  speakers?: string[]
  duration_minutes?: number
  processing_time?: number
  created_at: string
  updated_at: string
  user_id: number
}

export interface ActionItem {
  task: string
  assignee?: string
  due_date?: string
  priority: "high" | "medium" | "low"
  completed?: boolean
}

export interface SentimentAnalysis {
  overall_sentiment: "positive" | "neutral" | "negative"
  confidence: number
}

interface AuthResponse {
  access_token: string
  token_type: string
  user?: {
    id: number
    email: string
    full_name?: string
    is_active: boolean
  }
}

interface User {
  id: number
  email: string
  full_name?: string
  is_active: boolean
  is_verified: boolean
  avatar_url?: string
  created_at: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
      // Also set as cookie for middleware
      document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      // Clear cookie
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined" && !this.token) {
      this.token = localStorage.getItem("access_token")
    }
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add authorization header if token exists
    const token = this.getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch {
          // If we can't parse the error response, use the default message
        }

        // If unauthorized, clear token
        if (response.status === 401) {
          this.clearToken()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }

        throw new Error(errorMessage)
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append("username", credentials.email)
    formData.append("password", credentials.password)

    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Login failed")
    }

    const data = await response.json()
    this.setToken(data.access_token)
    return data
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    this.setToken(response.access_token)
    return response
  }

  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    return this.request<{ auth_url: string }>("/auth/google/url")
  }

  async googleCallback(code: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/google/callback", {
      method: "POST",
      body: JSON.stringify({ code }),
    })

    this.setToken(response.access_token)
    return response
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me")
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", {
        method: "POST",
      })
    } finally {
      this.clearToken()
    }
  }

  // User endpoints
  async getUserProfile(): Promise<any> {
    return this.request<any>("/users/me")
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.request<any>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export type { LoginCredentials, RegisterData, AuthResponse, User }

// Utility functions
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function getStatusColor(status: TranscriptionSession["status"]): string {
  switch (status) {
    case "scheduled":
      return "blue"
    case "starting":
    case "joining":
      return "yellow"
    case "recording":
      return "green"
    case "processing":
      return "orange"
    case "completed":
      return "emerald"
    case "failed":
      return "red"
    default:
      return "gray"
  }
}

export function getStatusLabel(status: TranscriptionSession["status"]): string {
  switch (status) {
    case "scheduled":
      return "Scheduled"
    case "starting":
      return "Starting"
    case "joining":
      return "Joining Meeting"
    case "recording":
      return "Recording"
    case "processing":
      return "Processing"
    case "completed":
      return "Completed"
    case "failed":
      return "Failed"
    default:
      return "Unknown"
  }
}
