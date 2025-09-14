"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, Download, FileText, Users, Smile, Meh, Frown } from "lucide-react"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { ActionItemsList } from "@/components/action-items-list"
import { TopicDistribution } from "@/components/topic-distribution"

// Sample meeting data
const MEETING_DATA = {
  id: "1",
  title: "Product Roadmap Planning",
  date: "May 20, 2025",
  time: "10:00 AM - 10:45 AM",
  duration: "45 minutes",
  participants: [
    { name: "John Smith", role: "Product Manager", initials: "JS" },
    { name: "Sarah Johnson", role: "UX Designer", initials: "SJ" },
    { name: "Michael Chen", role: "Developer", initials: "MC" },
    { name: "Emma Davis", role: "Marketing", initials: "ED" },
    { name: "Alex Rodriguez", role: "Sales", initials: "AR" },
  ],
  source: "Zoom",
  topics: ["Feature prioritization", "Q3 goals", "Resource allocation"],
  keyDecisions: ["Postpone feature X to Q4", "Hire 2 more developers", "Focus on mobile experience for Q3"],
  transcript: [
    { speaker: "John", text: "Welcome everyone to our product roadmap planning session.", time: "00:00:15" },
    {
      speaker: "Sarah",
      text: "Thanks John. I've prepared the Q3 priorities document as we discussed last week.",
      time: "00:00:22",
    },
    {
      speaker: "John",
      text: "Great. Let's start by discussing feature prioritization for the next quarter.",
      time: "00:00:30",
    },
    {
      speaker: "Michael",
      text: "I think we should focus on the new dashboard first. It's been highly requested by customers.",
      time: "00:00:45",
    },
    {
      speaker: "Sarah",
      text: "I agree, but we also need to consider the resource allocation. The design team is already working on the mobile app redesign.",
      time: "00:01:05",
    },
    {
      speaker: "John",
      text: "Good point. Let's decide on postponing feature X to Q4 to accommodate these priorities.",
      time: "00:01:20",
    },
    {
      speaker: "Emma",
      text: "From a marketing perspective, the dashboard would give us more to showcase in our upcoming campaign.",
      time: "00:01:35",
    },
    {
      speaker: "Michael",
      text: "That makes sense. We should also hire 2 more developers to help with the increased workload.",
      time: "00:01:50",
    },
    {
      speaker: "Alex",
      text: "Our enterprise customers have been asking about the mobile experience. We should prioritize that for Q3.",
      time: "00:02:10",
    },
    {
      speaker: "John",
      text: "Agreed. Let's finalize these decisions and move forward with the dashboard and mobile experience for Q3.",
      time: "00:02:25",
    },
  ],
  sentiment: {
    overall: "positive",
    score: 0.72,
    breakdown: {
      positive: 65,
      neutral: 25,
      negative: 10,
    },
  },
  actionItems: [
    {
      id: 1,
      task: "Update product roadmap with Q3 priorities",
      assignee: "John Smith",
      dueDate: "May 25, 2025",
      completed: false,
      priority: "high",
    },
    {
      id: 2,
      task: "Start hiring process for 2 developers",
      assignee: "Michael Chen",
      dueDate: "May 30, 2025",
      completed: false,
      priority: "medium",
    },
    {
      id: 3,
      task: "Prepare mobile experience design mockups",
      assignee: "Sarah Johnson",
      dueDate: "June 5, 2025",
      completed: false,
      priority: "high",
    },
    {
      id: 4,
      task: "Update marketing materials for dashboard feature",
      assignee: "Emma Davis",
      dueDate: "June 10, 2025",
      completed: false,
      priority: "medium",
    },
  ],
}

export default function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState<number | null>(null)

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Link href="/meetings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meetings
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{MEETING_DATA.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {MEETING_DATA.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3.5 w-3.5" />
                {MEETING_DATA.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-3.5 w-3.5" />
                {MEETING_DATA.participants.length} participants
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="mr-1 h-3.5 w-3.5" />
                {MEETING_DATA.source}
              </div>
            </div>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {MEETING_DATA.topics.map((topic, i) => (
            <Badge key={i} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="action-items">Action Items</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Key Decisions</CardTitle>
                  <CardDescription>Important decisions made during the meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {MEETING_DATA.keyDecisions.map((decision, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                        <span>{decision}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                  <CardDescription>People who attended the meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {MEETING_DATA.participants.map((participant, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{participant.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-muted-foreground">{participant.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Topic Distribution</CardTitle>
                  <CardDescription>Breakdown of topics discussed during the meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <TopicDistribution />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Meeting Sentiment</CardTitle>
                  <CardDescription>Overall sentiment of the meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {MEETING_DATA.sentiment.overall === "positive" && <Smile className="h-6 w-6 text-green-500" />}
                      {MEETING_DATA.sentiment.overall === "neutral" && <Meh className="h-6 w-6 text-yellow-500" />}
                      {MEETING_DATA.sentiment.overall === "negative" && <Frown className="h-6 w-6 text-red-500" />}
                      <p className="text-sm font-medium">{MEETING_DATA.sentiment.overall}</p>
                    </div>
                    <Progress value={MEETING_DATA.sentiment.score * 100} className="w-[60%]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Transcript</CardTitle>
                  <CardDescription>Full transcript of the meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {MEETING_DATA.transcript.map((entry, i) => (
                      <li key={i} className="flex items-start space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{entry.speaker.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{entry.speaker}</p>
                          <p className="text-xs text-muted-foreground">{entry.time}</p>
                          <p className="text-sm mt-2">{entry.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="action-items" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>Tasks assigned during the meeting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActionItemsList items={MEETING_DATA.actionItems} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Breakdown of sentiment scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <SentimentAnalysis sentiment={MEETING_DATA.sentiment} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
