"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, MessageSquareQuote, CheckCircle2, Mic, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TestimonialRequest, UserProfile } from "@/types"

export default function TestimonialSubmissionPage() {
    const { slug } = useParams()
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [request, setRequest] = useState<TestimonialRequest | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        rating: 5,
        message: "",
    })

    useEffect(() => {
        async function getRequestData() {
            const { data: requestData, error: requestError } = await supabase
                .from("testimonial_requests")
                .select("*")
                .eq("slug", slug)
                .single()

            if (requestError || !requestData) {
                setLoading(false)
                return
            }

            setRequest(requestData)

            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", requestData.user_id)
                .single()

            setUserProfile(userData)
            setLoading(false)

            // Track link open
            await supabase.from("analytics_events").insert({
                user_id: userData.id,
                event_type: "link_open",
                metadata: { slug, request_id: requestData.id }
            })

            // Increment view count in testimonial_requests
            await supabase.rpc('increment_view_count', { row_id: requestData.id })
        }

        getRequestData()
    }, [slug])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!request || !userProfile) return
        setSubmitting(true)

        const { error } = await supabase
            .from("testimonials")
            .insert([
                {
                    user_id: userProfile.id,
                    request_id: request.id,
                    client_name: formData.name,
                    rating: formData.rating,
                    message: formData.message,
                    type: 'text'
                }
            ])

        if (!error) {
            setSubmitted(true)

            // Track submission
            await supabase.from("analytics_events").insert({
                user_id: userProfile.id,
                event_type: "submission",
                metadata: { slug, request_id: request.id }
            })

            // Increment submission count in testimonial_requests
            await supabase.rpc('increment_submission_count', { row_id: request.id })
        }
        setSubmitting(false)
    }

    if (loading) return <div className="flex h-screen items-center justify-center">Loading form...</div>
    if (!request) return <div className="flex h-screen items-center justify-center text-xl font-bold">Request not found.</div>

    if (submitted) {
        return (
            <div className="flex flex-col h-screen items-center justify-center p-4 bg-muted/10">
                <div className="bg-card border p-8 rounded-3xl shadow-xl flex flex-col items-center text-center max-w-md w-full">
                    <CheckCircle2 className="h-20 w-20 text-primary mb-6 animate-in zoom-in" />
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Thank you!</h1>
                    <p className="text-muted-foreground mb-8">
                        Your testimonial has been submitted successfully to {userProfile?.email.split('@')[0]}.
                    </p>
                    <Button variant="outline" className="rounded-full w-full" onClick={() => router.push("/")}>
                        Close
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center py-10 px-4">
            <Card className="max-w-xl w-full border-none shadow-2xl p-4 sm:p-8">
                <CardHeader className="text-center space-y-4 pt-0">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <MessageSquareQuote className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold leading-tight">Leave a Review</CardTitle>
                    <CardDescription className="text-lg">
                        Help {userProfile?.email.split('@')[0]} grow by sharing your honest feedback about your project.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
                            <Input
                                id="name"
                                required
                                className="h-12 text-lg px-4"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-semibold">Rating</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-all hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            className={`h-10 w-10 ${star <= formData.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-base font-semibold">Message</Label>
                            <textarea
                                id="message"
                                required
                                className="flex min-h-[160px] w-full rounded-2xl border border-input bg-background px-4 py-4 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="What was your experience working together?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center p-4 border rounded-2xl bg-muted/20 opacity-40 cursor-not-allowed border-dashed relative">
                                <Mic className="h-5 w-5 mb-1" />
                                <span className="text-xs font-semibold">Record Audio</span>
                                <span className="absolute top-2 right-2 bg-primary/20 text-primary text-[10px] uppercase font-bold px-1 rounded">Pro</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 border rounded-2xl bg-muted/20 opacity-40 cursor-not-allowed border-dashed relative">
                                <Video className="h-5 w-5 mb-1" />
                                <span className="text-xs font-semibold">Record Video</span>
                                <span className="absolute top-2 right-2 bg-primary/20 text-primary text-[10px] uppercase font-bold px-1 rounded">Pro</span>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="pt-2">
                    <Button
                        form="testimonial-form"
                        size="lg"
                        className="w-full h-14 text-xl rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Send Testimonial"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
