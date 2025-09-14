"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GoogleCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        console.log("Google callback - code:", code, "error:", error)

        if (error) {
          throw new Error(`Google OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error("No authorization code received from Google")
        }

        console.log("Exchanging code for token...")
        // Exchange code for tokens
        const response = await apiClient.googleCallback(code)
        console.log("Google callback response:", response)

        if (response.access_token) {
          setSuccess(true)

          // Refresh user data in context
          await refreshUser()

          // Small delay to show success message
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        } else {
          throw new Error("Failed to authenticate with Google")
        }
      } catch (err: any) {
        console.error("Google callback error:", err)
        setError(err.message || "Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, router, refreshUser])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Authenticating...
            </CardTitle>
            <CardDescription>Please wait while we complete your Google sign-in</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-muted-foreground">Verifying your Google account...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Success!
            </CardTitle>
            <CardDescription>You have been successfully authenticated with Google</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Authentication Failed
            </CardTitle>
            <CardDescription>There was an error signing you in with Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/login")} className="flex-1">
                Back to Login
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}