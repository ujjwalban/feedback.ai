"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { TestimonialCard } from "@/components/dashboard/TestimonialCard"
import { CreateLinkModal } from "@/components/dashboard/CreateLinkModal"
import { Testimonial, UserProfile } from "@/types"
import { LogOut, ExternalLink, Moon, Sun, MessageSquareQuote, FileDown, Globe, FileText, Lock } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [stats, setStats] = useState({ total: 0, requests: 0, avg: 0 })

    useEffect(() => {
        async function getDashboardData() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            // Fetch user profile
            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single()

            setProfile(userData)

            // Fetch testimonials
            const { data: testimonialData } = await supabase
                .from("testimonials")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            setTestimonials(testimonialData || [])

            // Fetch request count
            const { count } = await supabase
                .from("testimonial_requests")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id)

            if (testimonialData) {
                const avg = testimonialData.length > 0
                    ? testimonialData.reduce((acc, current) => acc + current.rating, 0) / testimonialData.length
                    : 0
                setStats({ total: testimonialData.length, requests: count || 0, avg })
            }

            setLoading(false)
        }

        getDashboardData()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const deleteTestimonial = async (id: string) => {
        const { error } = await supabase
            .from("testimonials")
            .delete()
            .eq("id", id)

        if (!error) {
            setTestimonials(testimonials.filter(t => t.id !== id))
        }
    }

    const exportAsPDF = () => {
        alert("Exporting testimonials as PDF...")
    }

    const exportAsHTML = () => {
        if (profile?.plan !== 'pro') {
            alert("Upgrade to Pro to export as a cool HTML link!")
            return
        }
        alert("Generating your cool HTML testimonial link...")
    }

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading dashboard...</div>
    }

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <MessageSquareQuote className="h-6 w-6 text-primary" />
                        <span>Feedback.ai</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href={`/u/${profile?.username || 'user'}`} target="_blank">
                            <Button variant="outline" className="hidden sm:flex rounded-full gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Preview
                            </Button>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-full gap-2">
                                    <FileDown className="h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                <DropdownMenuLabel>Export Testimonials</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={exportAsPDF} className="gap-2 cursor-pointer">
                                    <FileText className="h-4 w-4" />
                                    <span>Export as PDF</span>
                                    <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">FREE</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportAsHTML} className="gap-2 cursor-pointer">
                                    <Globe className="h-4 w-4" />
                                    <span>Cool HTML Link</span>
                                    {profile?.plan !== 'pro' ? (
                                        <Lock className="ml-auto h-3 w-3 text-muted-foreground" />
                                    ) : (
                                        <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">PRO</span>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 md:px-6 space-y-10">
                {/* Top Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {profile?.email.split('@')[0]}. You have {testimonials.length} testimonials.
                        </p>
                    </div>
                    <CreateLinkModal plan={profile?.plan} />
                </div>

                {/* Stats Grid */}
                <DashboardStats
                    totalTestimonials={stats.total}
                    totalRequests={stats.requests}
                    avgRating={stats.avg}
                />

                {/* Content Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Latest Testimonials</h2>
                    </div>

                    {testimonials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-card text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <MessageSquareQuote className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">No testimonials yet</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Share your unique link with clients to start collecting beautiful social proof.
                            </p>
                            <CreateLinkModal plan={profile?.plan} />
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((testimonial) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                    onDelete={deleteTestimonial}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
