"use client"

import React from "react"

import { useState } from "react"
import { Megaphone, Calendar, AlertTriangle, Info, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface NoticesPopupProps {
  children: React.ReactNode
}

const notices = [
  {
    id: 1,
    type: "exam",
    title: "Mid-term Examinations Schedule",
    description:
      "Computer Science mid-term exams will be held from March 15-20, 2024. Please check the detailed schedule.",
    time: "1 day ago",
    unread: true,
    priority: "high",
    author: "Dr. Sarah Johnson",
    icon: Calendar,
  },
  {
    id: 2,
    type: "holiday",
    title: "Spring Break Holiday",
    description: "University will be closed from March 25-29 for spring break. Classes will resume on April 1st.",
    time: "2 days ago",
    unread: true,
    priority: "medium",
    author: "Administration Office",
    icon: Info,
  },
  {
    id: 3,
    type: "urgent",
    title: "Library Maintenance Notice",
    description: "The main library will be under maintenance this weekend. Digital resources remain available 24/7.",
    time: "3 days ago",
    unread: false,
    priority: "high",
    author: "Library Services",
    icon: AlertTriangle,
  },
  {
    id: 4,
    type: "general",
    title: "New Course Registration Open",
    description: "Registration for summer courses is now open. Deadline: March 30, 2024.",
    time: "1 week ago",
    unread: false,
    priority: "medium",
    author: "Academic Office",
    icon: Info,
  },
]

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export function NoticesPopup({ children }: NoticesPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [noticeList, setNoticeList] = useState(notices)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const unreadCount = noticeList.filter((n) => n.unread).length

  const markAsRead = (id) => {
    setNoticeList((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNoticeList((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const openNoticeModal = (notice) => {
    setSelectedNotice(notice)
    setIsModalOpen(true)
    markAsRead(notice.id)
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            {children}
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-orange-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Official Notices</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="p-2">
              {noticeList.map((notice) => {
                const IconComponent = notice.icon
                return (
                  <div
                    key={notice.id}
                    className={`group flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 ${
                      notice.unread ? "bg-orange-50 dark:bg-orange-950/20 border-l-2 border-l-orange-500" : ""
                    }`}
                    onClick={() => openNoticeModal(notice)}
                  >
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-semibold text-foreground truncate max-w-[280px]">
                              {notice.title}
                            </p>
                            <Badge className={priorityColors[notice.priority]} variant="secondary">
                              {notice.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/70 mb-1 font-medium truncate">By {notice.author}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          {notice.unread && <div className="h-2 w-2 bg-orange-500 rounded-full"></div>}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 mt-1 leading-relaxed line-clamp-2 break-words">
                        {notice.description}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{notice.time}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-orange-600 hover:text-orange-700 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            openNoticeModal(notice)
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Read full notice
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          <div className="p-3 border-t bg-muted/20">
            <Button variant="ghost" className="w-full text-xs" onClick={() => setIsOpen(false)}>
              View All Notices
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
          {selectedNotice && (
            <>
              <DialogHeader className="pb-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 flex items-center justify-center shadow-sm">
                    {React.createElement(selectedNotice.icon, {
                      className: "h-6 w-6 text-orange-600 dark:text-orange-400",
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl font-bold text-balance leading-tight mb-2">
                      {selectedNotice.title}
                    </DialogTitle>
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <Badge
                        className={`${priorityColors[selectedNotice.priority]} font-medium text-xs`}
                        variant="secondary"
                      >
                        {selectedNotice.priority.toUpperCase()} PRIORITY
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Posted {selectedNotice.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>•</span>
                        <span>Notice #{selectedNotice.id.toString().padStart(3, "0")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[65vh] pr-4">
                <Card className="mb-6 border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
                          {selectedNotice.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{selectedNotice.author}</p>
                        <p className="text-xs text-muted-foreground">Official Notice Publisher</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-orange-600" />
                        Notice Details
                      </h3>
                    </div>

                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <DialogDescription className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {selectedNotice.description}
                      </DialogDescription>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Category</p>
                          <p className="text-xs font-semibold capitalize">{selectedNotice.type}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Status</p>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400">Active</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Applies To</p>
                          <p className="text-xs font-semibold">All Students</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Effective Date</p>
                          <p className="text-xs font-semibold">Immediate</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>

              <div className="flex items-center justify-between pt-6 border-t bg-muted/20 -mx-6 -mb-6 px-6 py-4">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>Viewed by you</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Mark as Important
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-orange-600 hover:bg-orange-700 text-xs"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
