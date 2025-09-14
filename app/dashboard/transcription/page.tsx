"use client"

import AINotetakerScheduler from "@/components/ai-notetaker-scheduler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Brain, Users, FileText } from "lucide-react"

export default function TranscriptionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Notetaker</h1>
        <p className="text-gray-600 mt-2">
          Let AI join your meetings and provide intelligent transcription, summaries, and action items
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Mic className="h-4 w-4 text-blue-600" />
              Real-time Transcription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">High-quality speech-to-text using OpenAI Whisper</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-green-600" />
              Speaker Identification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">AI-powered speaker diarization and naming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">GPT-4 generated meeting summaries and insights</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-orange-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Automatically extracted tasks and assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Scheduler Component */}
      <AINotetakerScheduler />

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How AI Notetaker Works</CardTitle>
          <CardDescription>
            Our AI agent seamlessly joins your meetings and provides comprehensive notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2">Schedule & Join</h3>
              <p className="text-sm text-gray-600">
                AI agent automatically joins your Google Meet at the scheduled time
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2">Transcribe & Analyze</h3>
              <p className="text-sm text-gray-600">
                Real-time transcription with speaker identification using OpenAI Whisper
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2">Generate Insights</h3>
              <p className="text-sm text-gray-600">
                GPT-4 creates summaries, extracts action items, and identifies key decisions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}