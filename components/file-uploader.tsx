"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium">Drag and drop your files here</h3>
          <p className="text-sm text-muted-foreground">Supported formats: .txt, .docx, .pdf, .json, .vtt, .srt</p>
          <div className="mt-2">
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => {}}>
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".txt,.docx,.pdf,.json,.vtt,.srt"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-primary" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
