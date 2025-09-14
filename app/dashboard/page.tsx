"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  Play,
  Download,
  Share,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const upcomingMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    time: "Today, 2:00 PM",
    duration: "30 min",
    participants: ["John Doe", "Sarah Smith", "Mike Johnson"],
    platform: "Zoom",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Product Review Meeting",
    time: "Tomorrow, 10:00 AM",
    duration: "60 min",
    participants: ["Alice Brown", "Bob Wilson", "Carol Davis"],
    platform: "Google Meet",
    status: "upcoming",
  },
]

const recentTranscripts = [
  {
    id: 1,
    title: "Q4 Planning Session",
    date: "Dec 15, 2024",
    duration: "45 min",
    participants: 8,
    summary:
      "Discussed Q4 goals, budget allocation, and team restructuring. Key decisions made on product roadmap priorities.",
    sentiment: "positive",
    actionItems: 5,
    platform: "Microsoft Teams",
  },
  {
    id: 2,
    title: "Client Onboarding Call",
    date: "Dec 14, 2024",
    duration: "30 min",
    participants: 4,
    summary: "Walked through platform features, discussed implementation timeline, and addressed client concerns.",
    sentiment: "neutral",
    actionItems: 3,
    platform: "Zoom",
  },
  {
    id: 3,
    title: "Marketing Strategy Review",
    date: "Dec 13, 2024",
    duration: "60 min",
    participants: 6,
    summary: "Analyzed campaign performance, discussed budget reallocation, and planned Q1 marketing initiatives.",
    sentiment: "positive",
    actionItems: 7,
    platform: "Google Meet",
  },
]

const stats = [
  { label: "Total Meetings", value: "47", change: "+12%", trend: "up" },
  { label: "Hours Saved", value: "23.5", change: "+8%", trend: "up" },
  { label: "Action Items", value: "156", change: "+15%", trend: "up" },
  { label: "Avg. Sentiment", value: "85%", change: "+3%", trend: "up" },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100"
      case "neutral":
        return "text-yellow-600 bg-yellow-100"
      case "negative":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.full_name?.split(" ")[0] || "there"}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your meetings today.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard/upload">
              <FileText className="mr-2 h-4 w-4" />
              Upload Transcript
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your next scheduled meetings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/calendar">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{meeting.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {meeting.time}
                    <span>•</span>
                    {meeting.duration}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{meeting.participants.length} participants</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {meeting.platform}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {upcomingMeetings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming meetings</p>
                <p className="text-sm">Your schedule is clear!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transcripts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transcripts</CardTitle>
              <CardDescription>Your latest meeting summaries and insights</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/meetings">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTranscripts.map((transcript) => (
              <div key={transcript.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{transcript.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {transcript.platform}
                      </Badge>
                      <Badge className={`text-xs capitalize ${getSentimentColor(transcript.sentiment)}`}>
                        {transcript.sentiment}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {transcript.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {transcript.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {transcript.participants} participants
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{transcript.summary}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">{transcript.actionItems} action items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/meetings/${transcript.id}`}>
                            <Play className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
              <Link href="/dashboard/upload">
                <FileText className="h-6 w-6" />
                <span className="font-medium">Upload Transcript</span>
                <span className="text-xs text-muted-foreground">Add a new meeting recording</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
              <Link href="/dashboard/settings">
                <Users className="h-6 w-6" />
                <span className="font-medium">Connect Integrations</span>
                <span className="text-xs text-muted-foreground">Link your meeting platforms</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
              <Link href="/dashboard/analytics">
                <TrendingUp className="h-6 w-6" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-muted-foreground">See your meeting insights</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}