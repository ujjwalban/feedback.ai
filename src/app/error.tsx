"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
                <p className="text-muted-foreground max-w-md">
                    An unexpected error occurred. Please try again or contact support if the problem persists.
                </p>
            </div>
            <div className="flex gap-4">
                <Button onClick={reset} className="rounded-2xl h-12 px-8 font-bold">
                    Try Again
                </Button>
                <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold" onClick={() => window.location.href = "/"}>
                    Go Home
                </Button>
            </div>
        </div>
    )
}
