"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Filter } from "lucide-react"

const SAMPLE_ACTION_ITEMS = [
  {
    id: 1,
    task: "Update product roadmap with Q3 priorities",
    assignee: "Alex Johnson",
    dueDate: "May 25, 2025",
    meeting: "Product Roadmap Planning",
    completed: false,
    priority: "high",
  },
  {
    id: 2,
    task: "Create social media content calendar for June",
    assignee: "Sam Taylor",
    dueDate: "May 28, 2025",
    meeting: "Marketing Campaign Review",
    completed: false,
    priority: "medium",
  },
  {
    id: 3,
    task: "Fix login page performance issues",
    assignee: "Jamie Smith",
    dueDate: "May 22, 2025",
    meeting: "Weekly Team Standup",
    completed: true,
    priority: "high",
  },
  {
    id: 4,
    task: "Schedule interviews for developer position",
    assignee: "Morgan Lee",
    dueDate: "May 24, 2025",
    meeting: "Weekly Team Standup",
    completed: false,
    priority: "medium",
  },
  {
    id: 5,
    task: "Prepare Q2 budget report",
    assignee: "Casey Wilson",
    dueDate: "May 30, 2025",
    meeting: "Budget Planning",
    completed: false,
    priority: "high",
  },
]

export function ActionItemsList() {
  const [actionItems, setActionItems] = useState(SAMPLE_ACTION_ITEMS)
  const [filter, setFilter] = useState("all")

  const toggleComplete = (id: number) => {
    setActionItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const filteredItems = actionItems.filter((item) => {
    if (filter === "all") return true
    if (filter === "completed") return item.completed
    if (filter === "pending") return !item.completed
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100 hover:bg-red-200"
      case "medium":
        return "text-amber-500 bg-amber-100 hover:bg-amber-200"
      case "low":
        return "text-green-500 bg-green-100 hover:bg-green-200"
      default:
        return "text-slate-500 bg-slate-100 hover:bg-slate-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pending
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 border rounded-lg ${
              item.completed ? "bg-muted/50" : "bg-card"
            }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox checked={item.completed} onCheckedChange={() => toggleComplete(item.id)} className="mt-1" />
              <div className="space-y-1">
                <p className={item.completed ? "line-through text-muted-foreground" : ""}>{item.task}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {item.meeting}
                  </Badge>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.dueDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={`${getPriorityColor(item.priority)} capitalize`}>{item.priority}</Badge>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {item.assignee
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
