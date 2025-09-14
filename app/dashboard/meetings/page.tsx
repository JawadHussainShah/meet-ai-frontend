"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Download,
  Share,
  Copy,
  FileText,
  CheckCircle,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Sample meeting data
const meetingData = {
  id: "1",
  title: "Q4 Planning Session",
  date: "December 15, 2024",
  time: "10:00 AM - 10:45 AM",
  duration: "45 minutes",
  platform: "Microsoft Teams",
  participants: [
    { name: "John Smith", role: "Product Manager", avatar: "/placeholder.svg", initials: "JS" },
    { name: "Sarah Johnson", role: "UX Designer", avatar: "/placeholder.svg", initials: "SJ" },
    { name: "Michael Chen", role: "Developer", avatar: "/placeholder.svg", initials: "MC" },
    { name: "Emma Davis", role: "Marketing", avatar: "/placeholder.svg", initials: "ED" },
    { name: "Alex Rodriguez", role: "Sales", avatar: "/placeholder.svg", initials: "AR" },
    { name: "Lisa Wang", role: "Data Analyst", avatar: "/placeholder.svg", initials: "LW" },
    { name: "David Brown", role: "Designer", avatar: "/placeholder.svg", initials: "DB" },
    { name: "Rachel Green", role: "QA Engineer", avatar: "/placeholder.svg", initials: "RG" },
  ],
  summary:
    "Comprehensive Q4 planning session covering budget allocation, team restructuring, product roadmap priorities, and strategic initiatives for the upcoming quarter. Key decisions were made regarding resource allocation and timeline adjustments.",
  keyTopics: [
    { topic: "Budget Planning", duration: "12 minutes", percentage: 27 },
    { topic: "Team Structure", duration: "10 minutes", percentage: 22 },
    { topic: "Product Roadmap", duration: "8 minutes", percentage: 18 },
    { topic: "Marketing Strategy", duration: "7 minutes", percentage: 16 },
    { topic: "Technical Debt", duration: "5 minutes", percentage: 11 },
    { topic: "Other", duration: "3 minutes", percentage: 6 },
  ],
  sentiment: {
    overall: "positive",
    score: 78,
    breakdown: {
      positive: 65,
      neutral: 25,
      negative: 10,
    },
  },
  actionItems: [
    {
      id: 1,
      task: "Finalize Q4 budget allocation by department",
      assignee: "John Smith",
      dueDate: "Dec 20, 2024",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      task: "Create job descriptions for new developer positions",
      assignee: "Sarah Johnson",
      dueDate: "Dec 22, 2024",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      task: "Update product roadmap with Q1 priorities",
      assignee: "Michael Chen",
      dueDate: "Dec 18, 2024",
      priority: "high",
      completed: true,
    },
    {
      id: 4,
      task: "Schedule marketing campaign review meeting",
      assignee: "Emma Davis",
      dueDate: "Dec 19, 2024",
      priority: "medium",
      completed: false,
    },
    {
      id: 5,
      task: "Prepare technical debt assessment report",
      assignee: "Alex Rodriguez",
      dueDate: "Dec 25, 2024",
      priority: "low",
      completed: false,
    },
  ],
  transcript: [
    {
      speaker: "John Smith",
      time: "00:00:15",
      text: "Good morning everyone, thank you for joining our Q4 planning session. Let's start by reviewing our current budget status and discussing allocation for the remaining quarter.",
    },
    {
      speaker: "Sarah Johnson",
      time: "00:01:22",
      text: "Thanks John. I've prepared a comprehensive analysis of our current spending patterns. We're currently at 78% of our allocated budget with 6 weeks remaining in the quarter.",
    },
    {
      speaker: "Michael Chen",
      time: "00:02:45",
      text: "From a technical perspective, we need to address some critical infrastructure improvements. I estimate we'll need about 15% of the remaining budget for server upgrades and security enhancements.",
    },
    {
      speaker: "Emma Davis",
      time: "00:04:10",
      text: "The marketing team has identified several high-impact campaigns that could drive significant growth. We're requesting additional budget allocation for digital advertising and content creation.",
    },
    {
      speaker: "Alex Rodriguez",
      time: "00:05:30",
      text: "Our sales pipeline looks strong for Q4. We're on track to exceed our targets by 12%. This gives us some flexibility in budget allocation for strategic initiatives.",
    },
    {
      speaker: "Lisa Wang",
      time: "00:06:45",
      text: "The data shows that our customer acquisition cost has decreased by 8% this quarter, which is excellent news for our marketing ROI calculations.",
    },
    {
      speaker: "John Smith",
      time: "00:08:00",
      text: "Excellent insights everyone. Let's make some decisions on budget allocation and then move on to discussing our team structure for next quarter.",
    },
  ],
}

export default function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [actionItems, setActionItems] = useState(meetingData.actionItems)

  const toggleActionItem = (id: number) => {
    setActionItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="h-5 w-5 text-green-500" />
      case "neutral":
        return <Meh className="h-5 w-5 text-yellow-500" />
      case "negative":
        return <Frown className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/meetings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meetings
          </Link>
        </Button>
      </div>

      {/* Meeting Info */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{meetingData.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {meetingData.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meetingData.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {meetingData.participants.length} participants
            </span>
            <Badge variant="outline">{meetingData.platform}</Badge>
          </div>
          <p className="text-muted-foreground">{meetingData.summary}</p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Export as Word
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Copy Summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants ({meetingData.participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {meetingData.participants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} />
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="action-items">Action Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Topics Discussed</CardTitle>
                <CardDescription>Time spent on each topic during the meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meetingData.keyTopics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{topic.topic}</span>
                      <span className="text-sm text-muted-foreground">{topic.duration}</span>
                    </div>
                    <Progress value={topic.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">{topic.percentage}% of meeting time</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSentimentIcon(meetingData.sentiment.overall)}
                  Meeting Sentiment
                </CardTitle>
                <CardDescription>Overall emotional tone of the meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{meetingData.sentiment.score}%</div>
                  <div className="text-lg capitalize text-muted-foreground">{meetingData.sentiment.overall}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-green-500" />
                      Positive
                    </span>
                    <span>{meetingData.sentiment.breakdown.positive}%</span>
                  </div>
                  <Progress value={meetingData.sentiment.breakdown.positive} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Meh className="h-4 w-4 text-yellow-500" />
                      Neutral
                    </span>
                    <span>{meetingData.sentiment.breakdown.neutral}%</span>
                  </div>
                  <Progress value={meetingData.sentiment.breakdown.neutral} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Frown className="h-4 w-4 text-red-500" />
                      Negative
                    </span>
                    <span>{meetingData.sentiment.breakdown.negative}%</span>
                  </div>
                  <Progress value={meetingData.sentiment.breakdown.negative} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Meeting Transcript
              </CardTitle>
              <CardDescription>Full conversation transcript with timestamps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingData.transcript.map((entry, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-muted/50">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback>
                        {entry.speaker
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.speaker}</span>
                        <span className="text-xs text-muted-foreground">{entry.time}</span>
                      </div>
                      <p className="text-sm">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-items" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Tasks and follow-ups identified during the meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleActionItem(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.task}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Assigned to: {item.assignee}</span>
                        <span>Due: {item.dueDate}</span>
                        <Badge className={`${getPriorityColor(item.priority)} capitalize`}>{item.priority}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Speaking Time</p>
                    <p className="text-2xl font-bold">45 min</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                    <p className="text-2xl font-bold">87%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Action Items</p>
                    <p className="text-2xl font-bold">{actionItems.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Speaker Analysis</CardTitle>
              <CardDescription>Speaking time distribution among participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingData.participants.slice(0, 5).map((participant, index) => {
                  const speakingTime = Math.floor(Math.random() * 8) + 2 // Random speaking time for demo
                  const percentage = Math.floor((speakingTime / 45) * 100)

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{participant.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{participant.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{speakingTime} min</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}