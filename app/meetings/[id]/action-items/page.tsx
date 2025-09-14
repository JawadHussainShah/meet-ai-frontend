"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Calendar, MoreHorizontal, Plus } from "lucide-react"

// Sample meeting data
const MEETING_DATA = {
  id: "1",
  title: "Product Roadmap Planning",
  date: "May 20, 2025",
  actionItems: [
    {
      id: 1,
      task: "Update product roadmap with Q3 priorities",
      assignee: "John Smith",
      assigneeInitials: "JS",
      dueDate: "May 25, 2025",
      completed: false,
      priority: "high",
    },
    {
      id: 2,
      task: "Start hiring process for 2 developers",
      assignee: "Michael Chen",
      assigneeInitials: "MC",
      dueDate: "May 30, 2025",
      completed: false,
      priority: "medium",
    },
    {
      id: 3,
      task: "Prepare mobile experience design mockups",
      assignee: "Sarah Johnson",
      assigneeInitials: "SJ",
      dueDate: "June 5, 2025",
      completed: false,
      priority: "high",
    },
    {
      id: 4,
      task: "Update marketing materials for dashboard feature",
      assignee: "Emma Davis",
      assigneeInitials: "ED",
      dueDate: "June 10, 2025",
      completed: false,
      priority: "medium",
    },
  ],
}

export default function MeetingActionItemsPage({ params }: { params: { id: string } }) {
  const [actionItems, setActionItems] = useState(MEETING_DATA.actionItems)

  const toggleComplete = (id: number) => {
    setActionItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

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
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Link href={`/meetings/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meeting
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Action Items</h1>
            <p className="text-muted-foreground">
              Tasks and follow-ups from <span className="font-medium">{MEETING_DATA.title}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Action Item
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>
              {actionItems.filter((item) => !item.completed).length} pending,{" "}
              {actionItems.filter((item) => item.completed).length} completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    item.completed ? "bg-muted/20" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleComplete(item.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <p className={item.completed ? "line-through text-muted-foreground" : ""}>{item.task}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          {item.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(item.priority)} capitalize`}>{item.priority}</Badge>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{item.assigneeInitials}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuItem>Change Priority</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {actionItems.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No action items found for this meeting</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Action Item
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}