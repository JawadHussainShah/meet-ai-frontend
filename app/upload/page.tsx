"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploader } from "@/components/file-uploader"
import { ZoomConnector } from "@/components/zoom-connector"
import { MicrosoftConnector } from "@/components/microsoft-connector"
import { GoogleConnector } from "@/components/google-connector"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload successful",
            description: "Your transcript has been uploaded and is being analyzed.",
          })
          setTimeout(() => {
            router.push("/meetings/new-transcript")
          }, 1500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="container px-4 md:px-6 mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Transcript</h1>
          <p className="text-muted-foreground">
            Connect to your meeting platform or upload transcript files for analysis
          </p>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manual">Manual Upload</TabsTrigger>
            <TabsTrigger value="zoom">Zoom</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft Teams</TabsTrigger>
            <TabsTrigger value="google">Google Meet</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Upload</CardTitle>
                <CardDescription>Upload transcript files directly from your computer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUploader />

                <div className="space-y-2">
                  <Label htmlFor="meeting-name">Meeting Name</Label>
                  <Input id="meeting-name" placeholder="Enter a name for this meeting" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-date">Meeting Date</Label>
                  <Input id="meeting-date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-participants">Participants (optional)</Label>
                  <Input id="meeting-participants" placeholder="Enter participant names separated by commas" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? `Uploading (${uploadProgress}%)` : "Upload and Analyze"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="zoom" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect to Zoom</CardTitle>
                <CardDescription>Import meeting transcripts directly from your Zoom account</CardDescription>
              </CardHeader>
              <CardContent>
                <ZoomConnector onImport={handleUpload} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="microsoft" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect to Microsoft Teams</CardTitle>
                <CardDescription>Import meeting transcripts directly from your Microsoft Teams account</CardDescription>
              </CardHeader>
              <CardContent>
                <MicrosoftConnector onImport={handleUpload} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect to Google Meet</CardTitle>
                <CardDescription>Import meeting transcripts directly from your Google Meet account</CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleConnector onImport={handleUpload} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
