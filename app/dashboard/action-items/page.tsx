"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  Edit,
  Trash2,
  Send,
} from "lucide-react"
import { format } from "date-fns"

interface ActionItem {
  id: string
  title: string
  description: string
  assignee: {
    name: string
    email: string
    avatar?: string
  }
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed" | "overdue"
  meetingTitle: string
  meetingDate: string
  createdAt: string
  tags: string[]
}

const mockActionItems: ActionItem[] = [
  {
    id: "1",
    title: "Update product roadmap presentation",
    description: "Incorporate feedback from stakeholder meeting and update Q2 milestones",
    assignee: {
      name: "Sarah Johnson",
      email: "sarah@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-12-20",
    priority: "high",
    status: "in-progress",
    meetingTitle: "Product Strategy Review",
    meetingDate: "2024-12-15",
    createdAt: "2024-12-15",
    tags: ["product", "roadmap"],
  },
  {
    id: "2",
    title: "Schedule client onboarding sessions",
    description: "Coordinate with new clients for onboarding calls next week",
    assignee: {
      name: "Mike Chen",
      email: "mike@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-12-18",
    priority: "medium",
    status: "pending",
    meetingTitle: "Sales Team Standup",
    meetingDate: "2024-12-14",
    createdAt: "2024-12-14",
    tags: ["sales", "onboarding"],
  },
  {
    id: "3",
    title: "Review and approve marketing budget",
    description: "Analyze Q1 marketing spend proposals and provide feedback",
    assignee: {
      name: "Emily Davis",
      email: "emily@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-12-16",
    priority: "high",
    status: "overdue",
    meetingTitle: "Budget Planning Meeting",
    meetingDate: "2024-12-10",
    createdAt: "2024-12-10",
    tags: ["budget", "marketing"],
  },
  {
    id: "4",
    title: "Implement user feedback tracking",
    description: "Set up analytics to track user feedback from the new feature release",
    assignee: {
      name: "Alex Wilson",
      email: "alex@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-12-22",
    priority: "medium",
    status: "completed",
    meetingTitle: "Product Development Sync",
    meetingDate: "2024-12-12",
    createdAt: "2024-12-12",
    tags: ["analytics", "feedback"],
  },
  {
    id: "5",
    title: "Prepare quarterly team performance review",
    description: "Compile performance data and schedule individual review meetings",
    assignee: {
      name: "Lisa Brown",
      email: "lisa@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2024-12-25",
    priority: "low",
    status: "pending",
    meetingTitle: "HR Planning Session",
    meetingDate: "2024-12-13",
    createdAt: "2024-12-13",
    tags: ["hr", "performance"],
  },
]

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>(mockActionItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredItems = actionItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
    const matchesAssignee = assigneeFilter === "all" || item.assignee.name === assigneeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const toggleItemStatus = (id: string) => {
    setActionItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: item.status === "completed" ? "pending" : "completed" } : item,
      ),
    )
  }

  const stats = [
    {
      title: "Total Action Items",
      value: actionItems.length,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: actionItems.filter((item) => item.status === "completed").length,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: actionItems.filter((item) => item.status === "in-progress").length,
      color: "text-blue-600",
    },
    {
      title: "Overdue",
      value: actionItems.filter((item) => item.status === "overdue").length,
      color: "text-red-600",
    },
  ]

  const uniqueAssignees = Array.from(new Set(actionItems.map((item) => item.assignee.name)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Action Items</h1>
          <p className="text-muted-foreground">Track and manage tasks from your meetings</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Action Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Action Item</DialogTitle>
              <DialogDescription>Add a new task to track and assign to team members.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter action item title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the task in detail" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueAssignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
                Create Action Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search action items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Checkbox
                      checked={item.status === "completed"}
                      onCheckedChange={() => toggleItemStatus(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.title}
                        </h3>
                        <Badge className={getPriorityColor(item.priority)} variant="secondary">
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)} variant="secondary">
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status.replace("-", " ")}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={item.assignee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {item.assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.assignee.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due {format(new Date(item.dueDate), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{item.meetingTitle}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="board" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["pending", "in-progress", "completed", "overdue"].map((status) => (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                    {getStatusIcon(status)}
                    {status.replace("-", " ")}
                    <Badge variant="secondary" className="ml-auto">
                      {filteredItems.filter((item) => item.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredItems
                    .filter((item) => item.status === status)
                    .map((item) => (
                      <Card key={item.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <Badge className={getPriorityColor(item.priority)} variant="secondary">
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={item.assignee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {item.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(item.dueDate), "MMM d")}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
