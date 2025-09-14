'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { calendarAPI } from '@/lib/calendar-api'

export default function CalendarCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [integrationId, setIntegrationId] = useState<number | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error('No authorization code received')
        }

        // Handle the callback
        const result = await calendarAPI.handleCallback(code, state || undefined)

        if (result.success) {
          setStatus('success')
          setMessage(result.message)
          setIntegrationId(result.integration_id || null)

          // If this is a popup window, send message to parent
          if (window.opener) {
            window.opener.postMessage({
              type: 'CALENDAR_AUTH_SUCCESS',
              data: result
            }, window.location.origin)
            window.close()
            return
          }

          // Otherwise redirect after a delay
          setTimeout(() => {
            router.push('/dashboard/calendar')
          }, 3000)
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error('Calendar callback error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Failed to connect calendar')

        // If this is a popup window, send error message to parent
        if (window.opener) {
          window.opener.postMessage({
            type: 'CALENDAR_AUTH_ERROR',
            error: error instanceof Error ? error.message : 'Failed to connect calendar'
          }, window.location.origin)
          window.close()
          return
        }
      }
    }

    handleCallback()
  }, [searchParams, router])

  const handleRetry = () => {
    router.push('/dashboard/calendar')
  }

  const handleContinue = () => {
    router.push('/dashboard/calendar')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Calendar Integration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connecting your Google Calendar
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <CardTitle className="mt-2">Connecting Calendar</CardTitle>
                <CardDescription>
                  Please wait while we set up your calendar integration...
                </CardDescription>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
                <CardTitle className="mt-2 text-green-600">Success!</CardTitle>
                <CardDescription>
                  Your calendar has been connected successfully
                </CardDescription>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="mx-auto h-8 w-8 text-red-600" />
                <CardTitle className="mt-2 text-red-600">Connection Failed</CardTitle>
                <CardDescription>
                  There was an error connecting your calendar
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <Alert className={status === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                <AlertDescription className={status === 'error' ? 'text-red-800' : 'text-green-800'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && integrationId && (
              <div className="text-sm text-gray-600 text-center">
                <p>Integration ID: {integrationId}</p>
                <p className="mt-1">Redirecting to calendar dashboard...</p>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              {status === 'error' && (
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
              )}

              {status === 'success' && (
                <Button onClick={handleContinue}>
                  Go to Calendar
                </Button>
              )}

              {status === 'loading' && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By connecting your calendar, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}