"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, type User, type LoginCredentials, type RegisterData } from "./api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = apiClient.getToken()
      console.log("Checking auth, token:", token ? "exists" : "none")

      if (token) {
        const userData = await apiClient.getCurrentUser()
        console.log("User data:", userData)
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Clear invalid token
      apiClient.clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log("Attempting login for:", email)

      const credentials: LoginCredentials = { email, password }
      const authResponse = await apiClient.login(credentials)
      console.log("Login response:", authResponse)

      // Get user data after successful login
      const userData = await apiClient.getCurrentUser()
      console.log("User data after login:", userData)
      setUser(userData)

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })

      // Navigate to dashboard
      console.log("Navigating to dashboard...")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      console.log("Attempting registration for:", email)

      const registerData: RegisterData = {
        email,
        password,
        full_name: fullName,
      }

      const authResponse = await apiClient.register(registerData)
      console.log("Register response:", authResponse)

      // Get user data after successful registration
      const userData = await apiClient.getCurrentUser()
      console.log("User data after registration:", userData)
      setUser(userData)

      toast({
        title: "Account created!",
        description: "Welcome to Meeting IQ. Your account has been created successfully.",
      })

      // Navigate to dashboard
      console.log("Navigating to dashboard...")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      console.log("Initiating Google login...")

      // Get Google OAuth URL
      const { auth_url } = await apiClient.getGoogleAuthUrl()
      console.log("Google auth URL:", auth_url)

      // Redirect to Google OAuth
      window.location.href = auth_url
    } catch (error: any) {
      console.error("Google login error:", error)
      setLoading(false)
      toast({
        title: "Google login failed",
        description: error.message || "Unable to connect to Google. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await apiClient.logout()
      setUser(null)

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })

      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      // Clear local state even if API call fails
      apiClient.clearToken()
      setUser(null)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const userData = await apiClient.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
      // If refresh fails, user might need to login again
      setUser(null)
      apiClient.clearToken()
    }
  }

  const isAuthenticated = apiClient.isAuthenticated() && !!user

  console.log("Auth state:", { user: !!user, loading, isAuthenticated, token: !!apiClient.getToken() })

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}