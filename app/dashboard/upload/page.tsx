"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  FileAudio,
  FileVideo,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Mic,
  Video,
  LinkIcon,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  duration?: string
  participants?: string[]
}

const supportedFormats = [
  { type: "audio", formats: ["MP3", "WAV", "M4A", "FLAC"], icon: FileAudio },
  { type: "video", formats: ["MP4", "MOV", "AVI", "WEBM"], icon: FileVideo },
  { type: "text", formats: ["TXT", "DOCX", "PDF"], icon: FileText },
]

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [participants, setParticipants] = useState<string[]>([])
  const [newParticipant, setNewParticipant] = useState("")
  const [platform, setPlatform] = useState("")
  const [autoProcessing, setAutoProcessing] = useState(true)
  const [generateSummary, setGenerateSummary] = useState(true)
  const [extractActionItems, setExtractActionItems] = useState(true)
  const [sentimentAnalysis, setSentimentAnalysis] = useState(true)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".flac"],
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      "text/*": [".txt"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
  })

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            if (file.progress < 100) {
              return { ...file, progress: file.progress + 10 }
            } else if (file.status === "uploading") {
              return { ...file, status: "processing" }
            } else if (file.status === "processing") {
              return {
                ...file,
                status: "completed",
                duration: "45:32",
                participants: ["John Doe", "Sarah Smith", "Mike Johnson"],
              }
            }
          }
          return file
        }),
      )
    }, 500)

    setTimeout(() => clearInterval(interval), 6000)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()])
      setNewParticipant("")
    }
  }

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter((p) => p !== participant))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("audio/")) return FileAudio
    if (type.startsWith("video/")) return FileVideo
    return FileText
  }

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file")
      return
    }

    toast.success("Processing started! You'll be notified when it's complete.")
    // Here you would typically send the data to your backend
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Meeting Content</h1>
        <p className="text-muted-foreground">Upload audio, video, or text files to generate AI-powered insights</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="live">Live Recording</TabsTrigger>
          <TabsTrigger value="link">Meeting Link</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag and drop your meeting files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-lg font-medium">Drop the files here...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Support for audio, video, and text files up to 500MB
                    </p>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {supportedFormats.map((format) => (
                    <div key={format.type} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <format.icon className="h-4 w-4" />
                      <span>{format.formats.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">Uploaded Files</h4>
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.type)
                    return (
                      <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            {file.duration && <span>{file.duration}</span>}
                            {file.participants && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {file.participants.length} participants
                              </span>
                            )}
                          </div>
                          {file.status === "uploading" && (
                            <div className="mt-2">
                              <Progress value={file.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">Uploading... {file.progress}%</p>
                            </div>
                          )}
                          {file.status === "processing" && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                              Processing...
                            </div>
                          )}
                          {file.status === "completed" && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Ready for analysis
                            </div>
                          )}
                          {file.status === "error" && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              Upload failed
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meeting Details */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
              <CardDescription>Add context to improve AI analysis accuracy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Weekly Team Standup"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Meeting Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Meeting Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="meet">Google Meet</SelectItem>
                    <SelectItem value="webex">Cisco Webex</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Participants</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add participant name or email"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                  />
                  <Button onClick={addParticipant} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {participants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {participants.map((participant) => (
                      <Badge key={participant} variant="secondary" className="flex items-center gap-1">
                        {participant}
                        <button onClick={() => removeParticipant(participant)} className="ml-1 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Processing Options */}
          <Card>
            <CardHeader>
              <CardTitle>AI Processing Options</CardTitle>
              <CardDescription>Choose what insights to generate from your meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="auto" checked={autoProcessing} onCheckedChange={setAutoProcessing} />
                <Label htmlFor="auto">Auto-process after upload</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="summary" checked={generateSummary} onCheckedChange={setGenerateSummary} />
                <Label htmlFor="summary">Generate meeting summary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="actions" checked={extractActionItems} onCheckedChange={setExtractActionItems} />
                <Label htmlFor="actions">Extract action items</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sentiment" checked={sentimentAnalysis} onCheckedChange={setSentimentAnalysis} />
                <Label htmlFor="sentiment">Analyze sentiment</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={handleSubmit} disabled={files.length === 0}>
              Process Meeting
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Recording</CardTitle>
              <CardDescription>Record your meeting directly in the browser</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  <Button size="lg" className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Start Audio Recording
                  </Button>
                  <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Video className="h-5 w-5" />
                    Start Video Recording
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Browser recording requires microphone/camera permissions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Link Integration</CardTitle>
              <CardDescription>Connect directly to your meeting platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting URL</Label>
                <Input
                  id="meeting-link"
                  placeholder="https://zoom.us/j/123456789 or https://teams.microsoft.com/..."
                  type="url"
                />
              </div>
              <Button className="w-full">
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect to Meeting
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                We'll automatically join and record your meeting (with participant consent)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}