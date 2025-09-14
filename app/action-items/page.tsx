"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { Calendar, Download, MoreHorizontal, Search, ArrowUpDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

// Sample action items data
const ACTION_ITEMS = [
  {
    id: 1,
    task: "Update product roadmap with Q3 priorities",
    assignee: "John Smith",
    assigneeInitials: "JS",
    dueDate: "May 25, 2025",
    meeting: "Product Roadmap Planning",
    meetingId: "1",
    completed: false,
    priority: "high",
  },
  {
    id: 2,
    task: "Create social media content calendar for June",
    assignee: "Sam Taylor",
    assigneeInitials: "ST",
    dueDate: "May 28, 2025",
    meeting: "Marketing Campaign Review",
    meetingId: "2",
    completed: false,
    priority: "medium",
  },
  {
    id: 3,
    task: "Fix login page performance issues",
    assignee: "Jamie Smith",
    assigneeInitials: "JS",
    dueDate: "May 22, 2025",
    meeting: "Weekly Team Standup",
    meetingId: "3",
    completed: true,
    priority: "high",
  },
  {
    id: 4,
    task: "Schedule interviews for developer position",
    assignee: "Morgan Lee",
    assigneeInitials: "ML",
    dueDate: "May 24, 2025",
    meeting: "Weekly Team Standup",
    meetingId: "3",
    completed: false,
    priority: "medium",
  },
  {
    id: 5,
    task: "Prepare Q2 budget report",
    assignee: "Casey Wilson",
    assigneeInitials: "CW",
    dueDate: "May 30, 2025",
    meeting: "Budget Planning",
    meetingId: "5",
    completed: false,
    priority: "high",
  },
  {
    id: 6,
    task: "Review competitor analysis document",
    assignee: "Alex Johnson",
    assigneeInitials: "AJ",
    dueDate: "June 2, 2025",
    meeting: "Strategy Session",
    meetingId: "6",
    completed: false,
    priority: "medium",
  },
  {
    id: 7,
    task: "Update user onboarding flow based on feedback",
    assignee: "Sam Taylor",
    assigneeInitials: "ST",
    dueDate: "June 5, 2025",
    meeting: "UX Review",
    meetingId: "7",
    completed: false,
    priority: "high",
  },
  {
    id: 8,
    task: "Prepare sales presentation for enterprise clients",
    assignee: "Morgan Lee",
    assigneeInitials: "ML",
    dueDate: "May 29, 2025",
    meeting: "Sales Strategy",
    meetingId: "8",
    completed: true,
    priority: "high",
  },
]

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState(ACTION_ITEMS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "assignee">("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  const toggleComplete = (id: number) => {
    setActionItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  // Filter action items based on search, filter, and date range
  const filteredItems = actionItems.filter((item) => {
    // Search filter
    const matchesSearch =
      item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meeting.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesFilter =
      filter === "all" || (filter === "completed" && item.completed) || (filter === "pending" && !item.completed)

    // Date filter (if date range is selected)
    let matchesDate = true
    if (dateRange.from) {
      const itemDate = new Date(item.dueDate)
      if (dateRange.to) {
        matchesDate = itemDate >= dateRange.from && itemDate <= dateRange.to
      } else {
        matchesDate = itemDate >= dateRange.from
      }
    }

    return matchesSearch && matchesFilter && matchesDate
  })

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "dueDate") {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder]
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder]
      return sortDirection === "asc" ? priorityA - priorityB : priorityB - priorityA
    } else {
      // Sort by assignee
      return sortDirection === "asc" ? a.assignee.localeCompare(b.assignee) : b.assignee.localeCompare(a.assignee)
    }
  })

  const handleSort = (field: "dueDate" | "priority" | "assignee") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
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
    <div className="container px-4 md:px-6 mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Action Items</h1>
            <p className="text-muted-foreground">Track and manage tasks from all your meetings</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search action items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DateRangePicker date={dateRange} setDate={(range) => setDateRange(range)} className="w-full md:w-auto" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <div>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>
                  {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
                </CardDescription>
              </div>
              <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-sm font-medium">
                <div className="col-span-1"></div>
                <div className="col-span-5">Task</div>
                <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("assignee")}>
                  Assignee
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
                <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("dueDate")}>
                  Due Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
                <div className="col-span-1 flex items-center cursor-pointer" onClick={() => handleSort("priority")}>
                  Priority
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y">
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 gap-2 p-4 items-center ${item.completed ? "bg-muted/20" : ""}`}
                    >
                      <div className="col-span-1">
                        <Checkbox checked={item.completed} onCheckedChange={() => toggleComplete(item.id)} />
                      </div>
                      <div className="col-span-5">
                        <p className={item.completed ? "line-through text-muted-foreground" : ""}>{item.task}</p>
                        <Link
                          href={`/meetings/${item.meetingId}`}
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          {item.meeting}
                        </Link>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{item.assigneeInitials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{item.assignee}</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{item.dueDate}</span>
                      </div>
                      <div className="col-span-1">
                        <Badge className={`${getPriorityColor(item.priority)} capitalize`}>{item.priority}</Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                            <DropdownMenuItem>View Meeting</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No action items found</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}