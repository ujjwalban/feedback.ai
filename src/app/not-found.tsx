import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquareQuote } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
                <MessageSquareQuote className="h-8 w-8" />
                <span className="text-2xl font-black italic">Feedback.ai</span>
            </Link>
            <div className="text-center space-y-4">
                <h1 className="text-8xl font-black italic tracking-tighter text-primary">404</h1>
                <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
                <p className="text-muted-foreground max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
            </div>
            <Link href="/">
                <Button className="rounded-2xl h-12 px-8 font-bold">
                    Back to Home
                </Button>
            </Link>
        </div>
    )
}
