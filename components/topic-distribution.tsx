"use client"

import { useEffect, useRef } from "react"

const TOPIC_DATA = [
  { topic: "Budget Planning", percentage: 27, color: "#3b82f6" },
  { topic: "Team Structure", percentage: 22, color: "#10b981" },
  { topic: "Product Roadmap", percentage: 18, color: "#f59e0b" },
  { topic: "Marketing Strategy", percentage: 16, color: "#ef4444" },
  { topic: "Technical Debt", percentage: 11, color: "#8b5cf6" },
  { topic: "Other", percentage: 6, color: "#6b7280" },
]

interface TopicDistributionProps {
  expanded?: boolean
}

export function TopicDistribution({ expanded = false }: TopicDistributionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const size = expanded ? 300 : 200
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 20

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw pie chart
    let currentAngle = -Math.PI / 2 // Start from top

    TOPIC_DATA.forEach((item) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      currentAngle += sliceAngle
    })

    // Draw center circle for donut effect
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
  }, [expanded])

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="max-w-full" />

      <div className="grid grid-cols-2 gap-2 w-full">
        {TOPIC_DATA.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">
              {item.topic} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}