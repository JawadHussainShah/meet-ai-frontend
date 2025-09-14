"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Smile, Meh, Frown } from "lucide-react"

// Sample sentiment data
const SENTIMENT_DATA = {
  overall: "positive",
  score: 0.72,
  breakdown: {
    positive: 65,
    neutral: 25,
    negative: 10,
  },
  meetings: [
    {
      id: 1,
      title: "Product Roadmap Planning",
      date: "May 20, 2025",
      sentiment: "positive",
      score: 0.81,
      keyPhrases: ["excited about new features", "team collaboration", "innovative ideas"],
    },
    {
      id: 2,
      title: "Marketing Campaign Review",
      date: "May 18, 2025",
      sentiment: "neutral",
      score: 0.52,
      keyPhrases: ["mixed results", "some concerns", "potential opportunities"],
    },
    {
      id: 3,
      title: "Weekly Team Standup",
      date: "May 15, 2025",
      sentiment: "positive",
      score: 0.68,
      keyPhrases: ["good progress", "minor blockers", "team morale"],
    },
  ],
}

export function SentimentAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    // Draw sentiment gauge
    const startAngle = Math.PI
    const endAngle = 2 * Math.PI

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.lineWidth = 30
    ctx.strokeStyle = "#e2e8f0"
    ctx.stroke()

    // Draw sentiment arc
    const sentimentAngle = startAngle + (endAngle - startAngle) * SENTIMENT_DATA.score

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, "#ef4444") // Red (negative)
    gradient.addColorStop(0.5, "#f59e0b") // Yellow (neutral)
    gradient.addColorStop(1, "#10b981") // Green (positive)

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, sentimentAngle)
    ctx.lineWidth = 30
    ctx.strokeStyle = gradient
    ctx.stroke()

    // Draw score text
    ctx.fillStyle = "#0f172a"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${Math.round(SENTIMENT_DATA.score * 100)}%`, centerX, centerY)

    // Draw sentiment label
    ctx.fillStyle = "#64748b"
    ctx.font = "16px sans-serif"
    ctx.fillText(SENTIMENT_DATA.overall.toUpperCase(), centerX, centerY + 30)

    // Draw scale markers
    ctx.fillStyle = "#94a3b8"
    ctx.font = "12px sans-serif"

    // Negative marker
    ctx.textAlign = "left"
    ctx.fillText("Negative", centerX - radius, centerY + 60)

    // Positive marker
    ctx.textAlign = "right"
    ctx.fillText("Positive", centerX + radius, centerY + 60)

    // Draw needle
    const needleLength = radius - 20
    const needleAngle = startAngle + (endAngle - startAngle) * SENTIMENT_DATA.score
    const needleX = centerX + needleLength * Math.cos(needleAngle)
    const needleY = centerY + needleLength * Math.sin(needleAngle)

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(needleX, needleY)
    ctx.lineWidth = 3
    ctx.strokeStyle = "#0f172a"
    ctx.stroke()

    // Draw needle circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI)
    ctx.fillStyle = "#0f172a"
    ctx.fill()
  }, [])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />
      case "neutral":
        return <Meh className="h-4 w-4 text-amber-500" />
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-amber-100 text-amber-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={400} height={250} className="w-full max-w-md" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-green-50 rounded-lg">
          <Smile className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Positive</p>
          <p className="text-xl font-bold">{SENTIMENT_DATA.breakdown.positive}%</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <Meh className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Neutral</p>
          <p className="text-xl font-bold">{SENTIMENT_DATA.breakdown.neutral}%</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <Frown className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Negative</p>
          <p className="text-xl font-bold">{SENTIMENT_DATA.breakdown.negative}%</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium">Meeting Sentiment Breakdown</h3>
        {SENTIMENT_DATA.meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{meeting.title}</h4>
                  <p className="text-sm text-muted-foreground">{meeting.date}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {meeting.keyPhrases.map((phrase, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {phrase}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className={`flex items-center gap-1 capitalize ${getSentimentColor(meeting.sentiment)}`}>
                  {getSentimentIcon(meeting.sentiment)}
                  {meeting.sentiment} ({Math.round(meeting.score * 100)}%)
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
