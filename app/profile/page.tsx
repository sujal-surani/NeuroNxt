"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Edit, Camera, Trophy, Target, Users, X, User, ChevronRight, MessageCircle, Search, Clock } from "lucide-react"
import { StudentProfilePopup } from "@/components/student-profile-popup"
import { ImageCropper } from "@/components/image-cropper"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showConnections, setShowConnections] = useState(false)
  const [connectionSearch, setConnectionSearch] = useState("")
  const [showStudentInfo, setShowStudentInfo] = useState(false)
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<any>(null)
  const [emailOtp, setEmailOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isEmailChangeRequested, setIsEmailChangeRequested] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)

        // Fetch profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setProfileData(profile)
          setAvatarUrl(profile.avatar_url)
          setBio(profile.bio || "")
          setLocation(profile.location || "")
        }
      }
    }
    getUser()
  }, [supabase])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
    // Reset input value so same file can be selected again
    event.target.value = ''
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user) return

    try {
      setIsLoading(true)
      const fileExt = 'jpg' // Cropped image is always jpeg
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageBlob)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success("Avatar uploaded! Don't forget to save changes.")
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error("Error uploading avatar")
    } finally {
      setIsLoading(false)
      setShowCropper(false)
      setSelectedImage(null)
    }
  }

  const handleSaveChanges = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio,
          location,
          avatar_url: avatarUrl
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success("Profile updated successfully!")
      setIsEditing(false)

      // Refresh profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) setProfileData(profile)

    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  // User role - can be "student" or "teacher"
  const userRole = (user?.user_metadata?.role || "student") as "student" | "teacher"

  const fullName = user?.user_metadata?.full_name || "Student"
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
  const enrollmentNumber = user?.user_metadata?.enrollment_number || "N/A"
  const instituteCode = user?.user_metadata?.institute_code || "N/A"
  const branch = user?.user_metadata?.branch || "computer-technology"
  const semester = user?.user_metadata?.semester || "1"
  const email = user?.email || ""

  // Mock data for connected users
  const connectedUsers = [
    {
      id: 1,
      name: "Alice Smith",
      avatar: "AS",
      semester: "6th",
      branch: "Computer Technology",
      email: "alice.smith@university.edu",
      status: "online" as const,
      bio: "Passionate about AI and machine learning. Love coding and solving complex problems.",
      quizzesCompleted: 24,
      studyStreak: 15,
      connections: 156,
      enrollment: "2023-2027"
    },
    {
      id: 2,
      name: "Bob Johnson",
      avatar: "BJ",
      semester: "5th",
      branch: "Computer Technology",
      email: "bob.johnson@university.edu",
      status: "away" as const,
      bio: "Data enthusiast and statistics lover. Always ready to help with assignments.",
      quizzesCompleted: 18,
      studyStreak: 8,
      connections: 89,
      enrollment: "2023-2027"
    },
    {
      id: 3,
      name: "Carol Wilson",
      avatar: "CW",
      semester: "6th",
      branch: "Computer Technology",
      email: "carol.wilson@university.edu",
      status: "online" as const,
      bio: "Full-stack developer in training. Love building web applications and learning new technologies.",
      quizzesCompleted: 32,
      studyStreak: 22,
      connections: 203,
      enrollment: "2022-2026"
    },
    {
      id: 4,
      name: "David Brown",
      avatar: "DB",
      semester: "4th",
      branch: "Computer Technology",
      email: "david.brown@university.edu",
      status: "offline" as const,
      bio: "Gaming enthusiast and competitive programmer. Love algorithms and data structures.",
      quizzesCompleted: 12,
      studyStreak: 5,
      connections: 67,
      enrollment: "2023-2027"
    },
    {
      id: 5,
      name: "Emma Davis",
      avatar: "ED",
      semester: "6th",
      branch: "Computer Technology",
      email: "emma.davis@university.edu",
      status: "online" as const,
      bio: "Security researcher and ethical hacker. Passionate about protecting digital systems.",
      quizzesCompleted: 28,
      studyStreak: 18,
      connections: 178,
      enrollment: "2023-2027"
    },
    {
      id: 6,
      name: "Frank Miller",
      avatar: "FM",
      semester: "5th",
      branch: "Computer Technology",
      email: "frank.miller@university.edu",
      status: "online" as const,
      bio: "Mobile app developer and UI/UX enthusiast. Love creating beautiful user experiences.",
      quizzesCompleted: 28,
      studyStreak: 18,
      connections: 178,
      enrollment: "2022-2026"
    },
  ]

  const handleStudentInfoClick = (user: any) => {
    setSelectedStudentInfo(user)
    setShowStudentInfo(true)
  }

  const closeStudentInfo = () => {
    setShowStudentInfo(false)
    setSelectedStudentInfo(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-balance">Profile</h1>
              <Button onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6" key={user?.id || 'loading'}>
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={avatarUrl || "/student-avatar.png"} alt="Profile" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <div className="absolute -bottom-2 -right-2">
                            <input
                              type="file"
                              id="avatar-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileSelect}
                              disabled={isLoading}
                            />
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/90 transition-colors">
                                <Camera className="w-4 h-4" />
                              </div>
                            </Label>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{fullName}</h3>
                        <p className="text-muted-foreground">{branch.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Student</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {userRole === "student" && <Badge variant="secondary">Semester {semester}</Badge>}
                          <Badge
                            variant={userRole === "teacher" ? "default" : "outline"}
                            className={userRole === "teacher" ? "bg-primary text-primary-foreground" : ""}
                          >
                            {userRole === "teacher" ? "Teacher" : "Student"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="fullName"
                          value={fullName}
                          readOnly
                          disabled
                          className={`pl-10 disabled:opacity-75 ${isEditing ? "hover:cursor-not-allowed" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="enrollmentNumber"
                            value={enrollmentNumber}
                            readOnly
                            className="pl-10 disabled:opacity-75"
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={email}
                          className="pl-10"
                          disabled={!isEditing}
                          onChange={(e) => {
                            if (isEditing && e.target.value !== email) {
                              setIsEmailChangeRequested(true)
                              setNewEmail(e.target.value)
                            }
                          }}
                        />
                      </div>
                      {isEditing && isEmailChangeRequested && (
                        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Email change requires verification</p>
                          {!isOtpSent ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement OTP sending
                                console.log("Sending OTP to:", newEmail)
                                setIsOtpSent(true)
                              }}
                            >
                              Send OTP to new email
                            </Button>
                          ) : (
                            <div className="flex space-x-2">
                              <Input
                                type="text"
                                placeholder="Enter OTP"
                                value={emailOtp}
                                onChange={(e) => setEmailOtp(e.target.value)}
                                className="flex-1"
                                maxLength={6}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement OTP verification
                                  console.log("Verifying OTP:", emailOtp)
                                  alert("Email updated successfully!")
                                  setIsEmailChangeRequested(false)
                                  setIsOtpSent(false)
                                  setEmailOtp("")
                                }}
                              >
                                Verify
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instituteCode">Institute / College / University Code</Label>
                      <Input
                        id="instituteCode"
                        value={instituteCode}
                        readOnly
                        className="disabled:opacity-75"
                        disabled
                        aria-readonly
                      />
                      <p className="text-xs text-muted-foreground">Contact admin to update this code.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select defaultValue={branch} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="computer-technology">Computer Technology</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Other branches will be added soon</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Select defaultValue={semester} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Semester</SelectItem>
                            <SelectItem value="2">2nd Semester</SelectItem>
                            <SelectItem value="3">3rd Semester</SelectItem>
                            <SelectItem value="4">4th Semester</SelectItem>
                            <SelectItem value="5">5th Semester</SelectItem>
                            <SelectItem value="6">6th Semester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, Country"
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <Button className="w-full" onClick={handleSaveChanges} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats and Activity */}
              <div className="space-y-6">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setShowConnections(true)}
                >
                  <CardHeader>
                    <CardTitle>Connections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">Total Connections</span>
                      </div>
                      <span className="font-semibold">{connectedUsers.length}</span>
                    </div>

                    {connectedUsers.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Recent Connections</span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {connectedUsers.slice(0, 5).map((user) => (
                              <Avatar key={user.id} className="w-7 h-7 border-2 border-background">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {user.avatar}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {connectedUsers.length > 5 && (
                            <span className="text-xs text-muted-foreground ml-1">+{connectedUsers.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Study Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-secondary" />
                        <span className="text-sm">Quizzes Completed</span>
                      </div>
                      <span className="font-semibold">12</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-accent" />
                        <span className="text-sm">Study Streak</span>
                      </div>
                      <span className="font-semibold">5 days</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">Study Hours</span>
                      </div>
                      <span className="font-semibold">48h</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Quiz Master</p>
                        <p className="text-xs text-muted-foreground">Completed 10+ quizzes</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Consistent Learner</p>
                        <p className="text-xs text-muted-foreground">5-day study streak</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader>
                    <CardTitle>Classmates</CardTitle>
                    <CardDescription>Computer Technology • Semester 6</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Alice Smith</p>
                        <p className="text-xs text-muted-foreground">Following</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Chat
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">BJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Bob Johnson</p>
                        <p className="text-xs text-muted-foreground">Following</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Chat
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent text-accent-foreground text-xs">CW</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Carol Wilson</p>
                        <p className="text-xs text-muted-foreground">Not following</p>
                      </div>
                      <Button size="sm" variant="secondary">
                        Follow
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      View All Classmates
                    </Button>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>

          {showConnections && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowConnections(false)
                setConnectionSearch("")
              }}
            >
              <div
                className="bg-card rounded-lg shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden border"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Connections</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {connectedUsers.length} {connectedUsers.length === 1 ? 'connection' : 'connections'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setShowConnections(false)
                        setConnectionSearch("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search connections..."
                      value={connectionSearch}
                      onChange={(e) => setConnectionSearch(e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {connectedUsers
                    .filter((user) =>
                      user.name.toLowerCase().includes(connectionSearch.toLowerCase()) ||
                      user.branch.toLowerCase().includes(connectionSearch.toLowerCase())
                    )
                    .length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-3 rounded-full bg-muted/50 mb-3">
                        <Users className="w-8 h-8 text-muted-foreground opacity-50" />
                      </div>
                      <p className="text-sm font-medium mb-1">No connections found</p>
                      <p className="text-xs text-muted-foreground">
                        {connectionSearch ? "Try a different search term" : "You don't have any connections yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {connectedUsers
                        .filter((user) =>
                          user.name.toLowerCase().includes(connectionSearch.toLowerCase()) ||
                          user.branch.toLowerCase().includes(connectionSearch.toLowerCase())
                        )
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted"
                            onClick={() => handleStudentInfoClick(user)}
                          >
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.branch} • {user.semester} Semester
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0 h-8 text-xs px-3"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Handle chat navigation
                              }}
                            >
                              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                              Chat
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Student Profile Popup */}
          <StudentProfilePopup
            student={selectedStudentInfo}
            isOpen={showStudentInfo}
            onClose={closeStudentInfo}
          />

          <ImageCropper
            imageSrc={selectedImage}
            isOpen={showCropper}
            onClose={() => {
              setShowCropper(false)
              setSelectedImage(null)
            }}
            onCropComplete={handleCropComplete}
          />
        </main>
      </div>
    </div>
  )
}
