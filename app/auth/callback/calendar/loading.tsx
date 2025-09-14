import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function CalendarCallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <h2 className="text-lg font-semibold">Processing...</h2>
            <p className="text-sm text-gray-600">Please wait while we process your calendar connection.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
