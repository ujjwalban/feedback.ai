"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Testimonial, UserProfile } from "@/types"
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PublicProfilePage() {
    const { username } = useParams()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])

    useEffect(() => {
        async function getProfileData() {
            // Find user by username
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("username", username)
                .single()

            if (userError || !userData) {
                setLoading(false)
                return
            }

            setUserProfile(userData)

            // Fetch testimonials for this user
            const { data: testimonialData } = await supabase
                .from("testimonials")
                .select("*")
                .eq("user_id", userData.id)
                .order("created_at", { ascending: false })

            setTestimonials(testimonialData || [])
            setLoading(false)
        }

        getProfileData()
    }, [username])

    if (loading) return <div className="flex h-screen items-center justify-center">Loading portfolio...</div>
    if (!userProfile) return <div className="flex flex-col h-screen items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">User Not Found</h1>
        <Link href="/"><Button>Back to Home</Button></Link>
    </div>

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <section className="bg-primary/5 border-b py-20 px-4">
                <div className="container mx-auto max-w-5xl text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-card border rounded-full flex items-center justify-center shadow-lg mb-4">
                        <MessageSquareQuote className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">What my clients say about me</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        I've helped {testimonials.length} clients transform their projects. Here is their honest feedback about our journey together.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="rounded-full shadow-lg h-12 px-8">Hire Me</Button>
                        <Link href="/">
                            <Button variant="ghost" className="rounded-full text-xs font-semibold uppercase tracking-widest text-muted-foreground opacity-70">Power by Feedback.ai</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <main className="container mx-auto max-w-6xl py-20 px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.length === 0 ? (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <h3 className="text-2xl font-bold">No public testimonials yet</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">This freelancer is busy working on amazing projects. Check back soon!</p>
                        </div>
                    ) : (
                        testimonials.map((testimonial) => (
                            <Card key={testimonial.id} className="border-none shadow-xl hover:shadow-2xl transition-all rounded-3xl overflow-hidden group">
                                <CardHeader className="pb-2 pt-8 px-8">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 pb-8 flex-1">
                                    <p className="text-lg italic leading-relaxed text-foreground/90">
                                        "{testimonial.message}"
                                    </p>
                                </CardContent>
                                <CardFooter className="bg-muted/30 px-8 py-6 flex items-center justify-between border-t border-muted">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                                            {testimonial.client_name[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{testimonial.client_name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                                                Verified <CheckCircle2 className="h-2 w-2" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        {(new Date(testimonial.created_at)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <footer className="w-full py-12 border-t bg-card text-center">
                <p className="text-sm font-medium text-muted-foreground">© {new Date().getFullYear()} Collected using Feedback.ai</p>
            </footer>
        </div>
    )
}
