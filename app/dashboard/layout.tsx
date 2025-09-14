"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Calendar,
  FileText,
  Settings,
  CreditCard,
  Users,
  BarChart3,
  Upload,
  LogOut,
  User,
  Bell,
  HelpCircle,
  Airplay,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Home", href: "/dashboard", icon: Home },
      { title: "Calendar", href: "/dashboard/calendar", icon: Calendar },
      { title: "Transcribe", href: "/dashboard/transcription", icon: Airplay },
      { title: "Meetings", href: "/dashboard/meetings", icon: FileText },
      { title: "Upload", href: "/dashboard/upload", icon: Upload },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { title: "Action Items", href: "/dashboard/action-items", icon: Users },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
      { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">MeetIQ</span>
                <span className="text-xs text-muted-foreground">AI Meeting Assistant</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {navigation.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={"https://cdn-icons-png.flaticon.com/512/6596/6596121.png"} />
                        <AvatarFallback>
                          {user?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || user?.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium truncate">{user?.full_name || user?.email}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/billing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {navigation.flatMap((g) => g.items).find((item) => item.href === pathname)?.title || "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="hidden sm:flex">
                  Pro Plan
                </Badge>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}