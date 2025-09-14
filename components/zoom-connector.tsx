"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export function ZoomConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [meetings, setMeetings] = useState<any[]>([])

  const handleConnect = () => {
    // In a real implementation, this would redirect to Zoom OAuth flow
    // For demo purposes, we'll simulate a successful connection
    setTimeout(() => {
      setIsConnected(true)
      setMeetings([
        { id: 1, title: "Weekly Team Meeting", date: "May 20, 2025", hasTranscript: true },
        { id: 2, title: "Product Demo", date: "May 18, 2025", hasTranscript: true },
        { id: 3, title: "Client Onboarding", date: "May 15, 2025", hasTranscript: false },
      ])
    }, 1000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setMeetings([])
  }

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="rounded-full bg-blue-100 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2D8CFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5.5 14.5h-2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2"></path>
              <path d="M5.5 9.5V8a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5v-1.5"></path>
              <path d="M10 7v10"></path>
              <path d="M13 7v10"></path>
              <path d="M16 7v10"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">Connect to Zoom</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Import meeting transcripts directly from your Zoom account
            </p>
          </div>
          <Button onClick={handleConnect} className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/90">
            Connect Zoom Account
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-blue-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D8CFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5.5 14.5h-2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2"></path>
                  <path d="M5.5 9.5V8a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5v-1.5"></path>
                  <path d="M10 7v10"></path>
                  <path d="M13 7v10"></path>
                  <path d="M16 7v10"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">Zoom Account Connected</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Meetings with Transcripts</h4>
            <div className="space-y-2">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">{meeting.date}</p>
                    </div>
                    {meeting.hasTranscript ? (
                      <Button size="sm">
                        Import <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        No Transcript
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
