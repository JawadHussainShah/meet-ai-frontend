"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"

const SAMPLE_MEETINGS = [
  {
    id: 1,
    title: "Product Roadmap Planning",
    date: "May 20, 2025",
    duration: "45 minutes",
    participants: 8,
    keyTopics: ["Feature prioritization", "Q3 goals", "Resource allocation"],
    keyDecisions: ["Postpone feature X to Q4", "Hire 2 more developers"],
  },
  {
    id: 2,
    title: "Marketing Campaign Review",
    date: "May 18, 2025",
    duration: "30 minutes",
    participants: 5,
    keyTopics: ["Campaign performance", "Budget allocation", "Social media strategy"],
    keyDecisions: ["Increase ad spend by 15%", "Focus on TikTok for next campaign"],
  },
  {
    id: 3,
    title: "Weekly Team Standup",
    date: "May 15, 2025",
    duration: "25 minutes",
    participants: 12,
    keyTopics: ["Project updates", "Blockers", "Weekly goals"],
    keyDecisions: ["Implement daily check-ins", "Revise sprint planning process"],
  },
]

export function MeetingTimeline() {
  return (
    <div className="space-y-4">
      {SAMPLE_MEETINGS.map((meeting) => (
        <Card key={meeting.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{meeting.title}</h3>
              <Badge variant="outline">{meeting.date}</Badge>
            </div>

            <div className="flex space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {meeting.duration}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                {meeting.participants} participants
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium">Key Topics:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {meeting.keyTopics.map((topic, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-1">
              <p className="text-sm font-medium">Key Decisions:</p>
              <ul className="text-sm mt-1 list-disc list-inside">
                {meeting.keyDecisions.map((decision, i) => (
                  <li key={i}>{decision}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
