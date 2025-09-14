"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export function GoogleConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [meetings, setMeetings] = useState<any[]>([])

  const handleConnect = () => {
    // In a real implementation, this would redirect to Google OAuth flow
    // For demo purposes, we'll simulate a successful connection
    setTimeout(() => {
      setIsConnected(true)
      setMeetings([
        { id: 1, title: "Client Presentation", date: "May 21, 2025", hasTranscript: true },
        { id: 2, title: "Design Review", date: "May 16, 2025", hasTranscript: true },
        { id: 3, title: "Onboarding Session", date: "May 13, 2025", hasTranscript: false },
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
          <div className="rounded-full bg-red-100 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ea4335"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">Connect to Google Meet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Import meeting transcripts directly from your Google Meet account
            </p>
          </div>
          <Button onClick={handleConnect} className="bg-[#ea4335] hover:bg-[#ea4335]/90">
            Connect Google Account
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-red-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ea4335"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">Google Account Connected</p>
                <p className="text-sm text-muted-foreground">user@gmail.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Google Meet Meetings with Transcripts</h4>
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
