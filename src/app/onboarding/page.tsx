"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareQuote } from "lucide-react"

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = createClient()
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from("users")
            .upsert({
                id: user.id,
                username: username,
                email: user.email
            });

        if (error) {
            setError(error.message)
        } else {
            router.push("/dashboard")
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-4 flex flex-col items-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <MessageSquareQuote className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">One last step!</CardTitle>
                    <CardDescription className="text-center text-lg">
                        Choose a unique username for your public portfolio link.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleComplete}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-base font-semibold">Username</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">feedback.ai/u/</span>
                                <Input
                                    id="username"
                                    placeholder="john-doe"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-12"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full h-14 text-lg font-bold rounded-full shadow-lg" disabled={loading}>
                            {loading ? "Saving..." : "Create My Portfolio"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
