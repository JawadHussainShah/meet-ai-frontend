"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export function MicrosoftConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [meetings, setMeetings] = useState<any[]>([])

  const handleConnect = () => {
    // In a real implementation, this would redirect to Microsoft OAuth flow
    // For demo purposes, we'll simulate a successful connection
    setTimeout(() => {
      setIsConnected(true)
      setMeetings([
        { id: 1, title: "Project Kickoff", date: "May 19, 2025", hasTranscript: true },
        { id: 2, title: "Quarterly Review", date: "May 17, 2025", hasTranscript: true },
        { id: 3, title: "Team Sync", date: "May 14, 2025", hasTranscript: false },
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
              stroke="#0078d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="2"></rect>
              <rect width="8" height="8" x="6" y="6" rx="1"></rect>
              <path d="M18 16h.01"></path>
              <path d="M6 16h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M12 16h.01"></path>
              <path d="M18 10h.01"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">Connect to Microsoft Teams</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Import meeting transcripts directly from your Microsoft Teams account
            </p>
          </div>
          <Button onClick={handleConnect} className="bg-[#0078d4] hover:bg-[#0078d4]/90">
            Connect Microsoft Account
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
                  stroke="#0078d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="2"></rect>
                  <rect width="8" height="8" x="6" y="6" rx="1"></rect>
                  <path d="M18 16h.01"></path>
                  <path d="M6 16h.01"></path>
                  <path d="M12 10h.01"></path>
                  <path d="M12 16h.01"></path>
                  <path d="M18 10h.01"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">Microsoft Account Connected</p>
                <p className="text-sm text-muted-foreground">user@company.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Teams Meetings with Transcripts</h4>
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
