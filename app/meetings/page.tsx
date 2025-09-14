"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Search,
  ThumbsUp,
  Trash2,
  Users,
  Filter,
} from "lucide-react"

const SAMPLE_MEETINGS = [
  {
    id: "1",
    title: "Product Roadmap Planning",
    date: "May 20, 2025",
    duration: "45 minutes",
    participants: 8,
    sentiment: "positive",
    source: "Zoom",
    topics: ["Feature prioritization", "Q3 goals", "Resource allocation"],
  },
  {
    id: "2",
    title: "Marketing Campaign Review",
    date: "May 18, 2025",
    duration: "30 minutes",
    participants: 5,
    sentiment: "neutral",
    source: "Microsoft Teams",
    topics: ["Campaign performance", "Budget allocation", "Social media strategy"],
  },
  {
    id: "3",
    title: "Weekly Team Standup",
    date: "May 15, 2025",
    duration: "25 minutes",
    participants: 12,
    sentiment: "positive",
    source: "Zoom",
    topics: ["Project updates", "Blockers", "Weekly goals"],
  },
  {
    id: "4",
    title: "Customer Feedback Session",
    date: "May 12, 2025",
    duration: "60 minutes",
    participants: 4,
    sentiment: "negative",
    source: "Google Meet",
    topics: ["User experience", "Feature requests", "Bug reports"],
  },
  {
    id: "5",
    title: "Budget Planning",
    date: "May 10, 2025",
    duration: "50 minutes",
    participants: 6,
    sentiment: "neutral",
    source: "Manual Upload",
    topics: ["Q3 budget", "Resource allocation", "Cost optimization"],
  },
]

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [meetings, setMeetings] = useState(SAMPLE_MEETINGS)

  const filteredMeetings = meetings.filter((meeting) => meeting.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id))
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case "neutral":
        return <div className="h-4 w-4 rounded-full bg-amber-500" />
      case "negative":
        return <div className="h-4 w-4 rounded-full bg-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="container px-4 md:px-6 mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground">Browse and manage your analyzed meeting transcripts</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/upload">
              <Button>Upload New Transcript</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Meetings</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="zoom">Zoom</TabsTrigger>
            <TabsTrigger value="teams">Microsoft Teams</TabsTrigger>
            <TabsTrigger value="google">Google Meet</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => (
                  <Card key={meeting.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between">
                            <Link href={`/meetings/${meeting.id}`} className="hover:underline">
                              <h3 className="font-semibold text-lg">{meeting.title}</h3>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteMeeting(meeting.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-3.5 w-3.5" />
                              {meeting.date}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3.5 w-3.5" />
                              {meeting.duration}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="mr-1 h-3.5 w-3.5" />
                              {meeting.participants} participants
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <FileText className="mr-1 h-3.5 w-3.5" />
                              {meeting.source}
                            </div>
                            <div className="flex items-center text-sm">
                              {getSentimentIcon(meeting.sentiment)}
                              <span className="ml-1 capitalize">{meeting.sentiment}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {meeting.topics.map((topic, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="border-t md:border-t-0 md:border-l flex flex-row md:flex-col justify-around items-center p-4 bg-muted/30 md:w-48">
                          <Link href={`/meetings/${meeting.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/meetings/${meeting.id}/action-items`}>
                            <Button variant="ghost" size="sm" className="w-full mt-2">
                              Action Items
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No meetings found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchQuery
                      ? `No meetings matching "${searchQuery}"`
                      : "Upload your first transcript to get started"}
                  </p>
                  {!searchQuery && (
                    <Link href="/upload" className="mt-4 inline-block">
                      <Button>Upload Transcript</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="mt-6">
            <div className="grid gap-4">
              {filteredMeetings.slice(0, 3).map((meeting) => (
                /* Same card structure as above */
                <Card key={meeting.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between">
                          <Link href={`/meetings/${meeting.id}`} className="hover:underline">
                            <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteMeeting(meeting.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            {meeting.date}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {meeting.duration}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            {meeting.participants} participants
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FileText className="mr-1 h-3.5 w-3.5" />
                            {meeting.source}
                          </div>
                          <div className="flex items-center text-sm">
                            {getSentimentIcon(meeting.sentiment)}
                            <span className="ml-1 capitalize">{meeting.sentiment}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {meeting.topics.map((topic, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="border-t md:border-t-0 md:border-l flex flex-row md:flex-col justify-around items-center p-4 bg-muted/30 md:w-48">
                        <Link href={`/meetings/${meeting.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/meetings/${meeting.id}/action-items`}>
                          <Button variant="ghost" size="sm" className="w-full mt-2">
                            Action Items
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {/* Other tab contents would follow the same pattern */}
        </Tabs>
      </div>
    </div>
  )
}
