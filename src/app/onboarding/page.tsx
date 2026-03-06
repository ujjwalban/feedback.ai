"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareQuote, ChevronLeft, CheckCircle2, Zap } from "lucide-react"
import { motion } from "framer-motion"

type OnboardingStep = 1 | 2 | 3 | 4

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = createClient()
    const [step, setStep] = useState<OnboardingStep>(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Step 1: Username
    const [username, setUsername] = useState("")

    // Step 2: Profile Details
    const [profileUrl, setProfileUrl] = useState("")
    const [profileDescription, setProfileDescription] = useState("")

    // Step 3: First Request
    const [requestSlug, setRequestSlug] = useState("")
    const [requestDescription, setRequestDescription] = useState("")

    // Step 4: Preferences
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [publicProfile, setPublicProfile] = useState(true)

    const handleNext = async () => {
        if (step === 1) {
            if (!username.trim()) {
                setError("Username is required")
                return
            }
            setError(null)
            setStep(2)
        } else if (step === 2) {
            setError(null)
            setStep(3)
        } else if (step === 3) {
            setError(null)
            setStep(4)
        } else if (step === 4) {
            await handleComplete()
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep((step - 1) as OnboardingStep)
            setError(null)
        }
    }

    const handleComplete = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError("Not authenticated")
                return
            }

            // Update user profile
            const { error: updateError } = await supabase
                .from("users")
                .update({
                    username: username.toLowerCase(),
                })
                .eq("id", user.id)

            if (updateError) {
                setError(updateError.message)
                return
            }

            // Create first testimonial request if slug provided
            if (requestSlug.trim()) {
                const { error: requestError } = await supabase
                    .from("testimonial_requests")
                    .insert([{
                        user_id: user.id,
                        slug: requestSlug.toLowerCase(),
                        description: requestDescription,
                    }])

                if (requestError) {
                    console.error("Error creating request:", requestError)
                }
            }

            // Save onboarding preferences to user metadata
            const { error: prefError } = await supabase.auth.updateUser({
                data: {
                    onboarding_completed: true,
                    email_notifications: emailNotifications,
                    public_profile: publicProfile,
                },
            })

            if (prefError) {
                console.error("Error saving preferences:", prefError)
            }

            router.push("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        {
            number: 1,
            title: "Create Your Handle",
            description: "Choose a unique username for your public testimonial page",
        },
        {
            number: 2,
            title: "Profile Setup",
            description: "Add profile details to personalize your presence",
        },
        {
            number: 3,
            title: "First Testimonial",
            description: "Create your first testimonial request link",
        },
        {
            number: 4,
            title: "Preferences",
            description: "Configure your account settings",
        },
    ]

    const progress = (step / 4) * 100

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 px-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Progress Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-black italic">Welcome to Feedback.ai</h1>
                        <span className="text-sm font-bold text-muted-foreground">
                            Step {step} of 4
                        </span>
                    </div>
                    <motion.div
                        className="h-2 bg-muted rounded-full overflow-hidden"
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-primary"
                        />
                    </motion.div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between">
                    {steps.map((s) => (
                        <motion.div
                            key={s.number}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: s.number * 0.1 }}
                            className={`flex flex-col items-center gap-2 cursor-pointer flex-1 text-center`}
                            onClick={() => s.number <= step && setStep(s.number as OnboardingStep)}
                        >
                            <motion.div
                                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                    s.number === step
                                        ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                                        : s.number < step
                                        ? "bg-green-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                }`}
                                animate={{ scale: s.number === step ? 1.1 : 1 }}
                            >
                                {s.number < step ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    s.number
                                )}
                            </motion.div>
                            <span className={`text-xs font-semibold ${s.number <= step ? "text-foreground" : "text-muted-foreground"}`}>
                                {s.title}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Step Content */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-none shadow-xl">
                        <CardHeader className="space-y-4 flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center"
                            >
                                <MessageSquareQuote className="h-8 w-8 text-primary" />
                            </motion.div>
                            <CardTitle className="text-3xl font-bold">{steps[step - 1].title}</CardTitle>
                            <CardDescription className="text-lg">
                                {steps[step - 1].description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {error && (
                                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                                    {error}
                                </div>
                            )}

                            {/* Step 1: Username */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-base font-semibold">
                                            Username
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground font-medium">feedback.ai/u/</span>
                                            <Input
                                                id="username"
                                                placeholder="janedoe"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                                className="h-12 flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            This is your unique public profile URL. It cannot be changed later.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Profile Details */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="profileUrl" className="text-base font-semibold">
                                            Portfolio/Website URL (Optional)
                                        </Label>
                                        <Input
                                            id="profileUrl"
                                            placeholder="https://yourwebsite.com"
                                            value={profileUrl}
                                            onChange={(e) => setProfileUrl(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="profileDescription" className="text-base font-semibold">
                                            Bio/Description (Optional)
                                        </Label>
                                        <textarea
                                            id="profileDescription"
                                            placeholder="Tell visitors about your services..."
                                            value={profileDescription}
                                            onChange={(e) => setProfileDescription(e.target.value)}
                                            className="h-24 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: First Request */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="requestSlug" className="text-base font-semibold">
                                            Request Link Name
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground font-medium">feedback.ai/req/</span>
                                            <Input
                                                id="requestSlug"
                                                placeholder="first-testimonial"
                                                value={requestSlug}
                                                onChange={(e) => setRequestSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                                className="h-12 flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            This is the link you'll send to clients to request testimonials.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="requestDescription" className="text-base font-semibold">
                                            Request Description (Optional)
                                        </Label>
                                        <textarea
                                            id="requestDescription"
                                            placeholder="Please share how our service helped you..."
                                            value={requestDescription}
                                            onChange={(e) => setRequestDescription(e.target.value)}
                                            className="h-20 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Preferences */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border/50">
                                            <input
                                                type="checkbox"
                                                id="emailNotifications"
                                                checked={emailNotifications}
                                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                                className="h-5 w-5 rounded border-border cursor-pointer"
                                            />
                                            <label htmlFor="emailNotifications" className="flex-1 cursor-pointer">
                                                <p className="font-semibold">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Get notified when you receive new testimonials</p>
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border/50">
                                            <input
                                                type="checkbox"
                                                id="publicProfile"
                                                checked={publicProfile}
                                                onChange={(e) => setPublicProfile(e.target.checked)}
                                                className="h-5 w-5 rounded border-border cursor-pointer"
                                            />
                                            <label htmlFor="publicProfile" className="flex-1 cursor-pointer">
                                                <p className="font-semibold">Public Profile</p>
                                                <p className="text-sm text-muted-foreground">Make your testimonial wall visible to search engines</p>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-start gap-3">
                                        <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-foreground">
                                            You're all set! Start by creating your first testimonial request and share the link with your clients.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex gap-3 pt-6">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 h-12"
                                onClick={handleBack}
                                disabled={step === 1 || loading}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1 h-12 font-semibold"
                                onClick={handleNext}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : step === 4 ? "Get Started" : "Next"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
