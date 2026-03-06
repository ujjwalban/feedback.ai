"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareQuote, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    if (sent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
                <Card className="w-full max-w-md border-none shadow-xl text-center">
                    <CardHeader className="space-y-4 flex flex-col items-center">
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription>
                            We sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link href="/login">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-4 text-primary">
                        <MessageSquareQuote className="h-8 w-8" />
                        <span>Feedback.ai</span>
                    </Link>
                    <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email and we&apos;ll send you a reset link
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleReset}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button size="lg" className="w-full h-12 text-base font-semibold" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <Link href="/login" className="text-sm text-primary hover:underline font-medium">
                            Back to Login
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
