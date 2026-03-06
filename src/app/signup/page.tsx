"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareQuote } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Sign up with Supabase Auth
            const { data: { user }, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        name,
                        username,
                    },
                },
            })

            if (signupError) {
                setError(signupError.message)
                setLoading(false)
                return
            }

            // Update user profile with name and username
            if (user) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        username: username.toLowerCase(),
                    })
                    .eq('id', user.id)

                if (updateError) {
                    setError(updateError.message)
                    setLoading(false)
                    return
                }

                // Check if this email should get pro access (for testing)
                const proAccessEmails = ['ujju.ban1@gmail.com']
                if (proAccessEmails.includes(email.toLowerCase())) {
                    await supabase
                        .from('users')
                        .update({ plan: 'pro' })
                        .eq('id', user.id)
                }
            }

            router.push("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-4 text-primary">
                        <MessageSquareQuote className="h-8 w-8" />
                        <span>Feedback.ai</span>
                    </Link>
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Sign up in seconds to start collecting testimonials
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jane Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="janedoe"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                className="h-11"
                            />
                            <p className="text-xs text-muted-foreground">Your public profile URL: /u/{username || 'yourname'}</p>
                        </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11"
                                placeholder="Minimum 6 characters"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button size="lg" className="w-full h-12 text-base font-semibold" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
