"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { OnboardingModal } from "@/components/onboarding-modal"
import {
  BookOpen,
  Brain,
  MessageCircle,
  Trophy,
  Target,
  Zap,
  Search,
  Sparkles,
  Bookmark,
  Calendar,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  dueDate: string
  subject: string
  completed: boolean
}

export default function Dashboard() {
  const [aiSearchQuery, setAiSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        setUserName(user.user_metadata.full_name || "Student")

        // Check if user is onboarded
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_onboarded')
          .eq('id', user.id)
          .single()

        if (profile && !profile.is_onboarded) {
          setShowOnboarding(true)
        }
      }
    }
    getUser()
  }, [supabase])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  const upcomingTasks: Task[] = [
    // ... (keep existing tasks or fetch them later)
    {
      id: "1",
      title: "Data Structures Assignment",
      description:
        "Complete the binary tree implementation and analysis. Include time complexity analysis for all operations and provide test cases.",
      category: "assignments",
      priority: "high",
      dueDate: "2024-01-15",
      subject: "Computer Science",
      completed: false,
    },
    {
      id: "2",
      title: "Machine Learning Quiz",
      description:
        "Study chapters 1-5 covering supervised learning, regression, and classification algorithms. Focus on understanding the mathematical foundations.",
      category: "exam",
      priority: "medium",
      dueDate: "2024-01-16",
      subject: "AI/ML",
      completed: false,
    },
    {
      id: "3",
      title: "Database Design Project",
      description:
        "Design and implement a normalized database schema for an e-commerce system. Include ER diagrams and SQL implementation.",
      category: "project",
      priority: "medium",
      dueDate: "2024-01-18",
      subject: "Database Systems",
      completed: false,
    },
  ]

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false)
    setSelectedTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive"
      case "medium":
        return "bg-chart-1"
      case "low":
        return "bg-chart-3"
      default:
        return "bg-muted"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "low":
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (aiSearchQuery.trim()) {
      router.push(`/ai-tools?query=${encodeURIComponent(aiSearchQuery)}`)
    }
  }

  const handleGenerateQuiz = () => {
    router.push("/ai-tools?tab=quiz")
  }

  const handleTaskManager = () => {
    router.push("/tasks")
  }

  const handleSavedResources = () => {
    router.push("/notes?tab=saved")
  }

  const handleViewTasks = () => {
    router.push("/tasks")
  }

  const getRemainingDays = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getRemainingDaysStyle = (remainingDays: number) => {
    if (remainingDays < 0) {
      return "bg-red-100 text-red-800 border-red-200"
    } else if (remainingDays <= 3) {
      return "bg-orange-100 text-orange-800 border-orange-200"
    } else if (remainingDays <= 7) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    } else {
      return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getRemainingDaysText = (remainingDays: number) => {
    if (remainingDays < 0) {
      return "Overdue"
    } else if (remainingDays === 0) {
      return "Due today"
    } else {
      return `${remainingDays} day${remainingDays !== 1 ? "s" : ""} remaining`
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">Welcome back, {userName || "Student"}!</h1>
                <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  <Zap className="w-3 h-3 mr-1" />5 Day Streak
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Quizzes Taken</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-secondary">+2</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5 Days</div>
                  <p className="text-xs text-muted-foreground">Personal best: 12 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#3</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-secondary">↑2</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notes Studied</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-secondary">+8</span> from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Tasks */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Upcoming Tasks</CardTitle>
                        <CardDescription>Tasks sorted by nearest due date</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewTasks}
                        className="h-8 w-8 p-0 hover:bg-secondary/80"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className={`w-3 h-3 ${getPriorityColor(task.priority)} rounded-full`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-base">{task.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{task.subject}</span>
                            <div
                              className={`flex items-center text-xs ${task.priority === "high" ? "text-destructive" : task.priority === "medium" ? "text-chart-1" : "text-chart-3"}`}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              <span className="text-xs">
                                Due{" "}
                                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-primary" />
                      AI Study Assistant
                    </CardTitle>
                    <CardDescription>Ask anything about your studies and get instant AI-powered help</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAiSearch} className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          placeholder="Ask me anything... e.g., 'Explain machine learning algorithms'"
                          value={aiSearchQuery}
                          onChange={(e) => setAiSearchQuery(e.target.value)}
                          className="pl-12 h-12 text-base bg-background/50 border-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10 text-xs"
                            onClick={() => setAiSearchQuery("Explain data structures")}
                          >
                            Explain data structures
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10 text-xs"
                            onClick={() => setAiSearchQuery("Create a study plan")}
                          >
                            Create a study plan
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10 text-xs"
                            onClick={() => setAiSearchQuery("Generate quiz questions")}
                          >
                            Generate quiz questions
                          </Badge>
                        </div>
                        <Button type="submit" disabled={!aiSearchQuery.trim()} className="ml-2">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Ask AI
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription className="text-xs">Your latest study sessions and achievements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-card border">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Completed AI Quiz: Data Structures</p>
                        <p className="text-xs text-muted-foreground">Score: 85% • 2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-card border">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Studied Notes: Machine Learning Basics</p>
                        <p className="text-xs text-muted-foreground">3 topics reviewed • 5 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-card border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Joined Group Discussion: Algorithms</p>
                        <p className="text-xs text-muted-foreground">5 new messages • 1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={handleGenerateQuiz}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Generate AI Quiz
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={handleTaskManager}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Task Manager
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={handleSavedResources}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Saved Resources
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Task Details Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-8 w-8 p-0 hover:bg-destructive/10 z-50"
              onClick={handleCloseTaskDialog}
            >
              <X className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-xl font-semibold pr-8">{selectedTask?.title}</DialogTitle>
            <DialogDescription>Task details and information</DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div
                  className={`px-4 py-2 rounded-full border font-semibold text-sm ${getRemainingDaysStyle(getRemainingDays(selectedTask.dueDate))}`}
                >
                  {getRemainingDaysText(getRemainingDays(selectedTask.dueDate))}
                </div>
              </div>

              {/* Task Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-sm">{selectedTask.subject}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm capitalize">{selectedTask.category}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getPriorityColor(selectedTask.priority)} rounded-full`}></div>
                    <span className="text-sm capitalize">{selectedTask.priority}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedTask.description}</p>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center space-x-2">
                  {selectedTask.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Completed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Onboarding Modal */}
      {
        user && (
          <OnboardingModal
            isOpen={showOnboarding}
            userId={user.id}
            currentFullName={user.user_metadata?.full_name || ""}
            onComplete={handleOnboardingComplete}
          />
        )
      }
    </div >
  )
}
