"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Testimonial, UserProfile } from "@/types";
import {
    MessageSquareQuote,
    TrendingUp,
    Users,
    Plus,
    ArrowRight,
    Sparkles,
    Zap,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CreateLinkModal } from "@/components/dashboard/CreateLinkModal";
import Link from "next/link";
import { TestimonialCard } from "@/components/dashboard/TestimonialCard";

export default function DashboardPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [stats, setStats] = useState({ total: 0, requests: 0, avg: 0 });

    useEffect(() => {
        async function getDashboardData() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            setProfile(userData);

            const { data: testimonialData } = await supabase
                .from("testimonials")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(3);

            setTestimonials(testimonialData || []);

            const { count: totalTestimonials } = await supabase
                .from("testimonials")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id);

            const { count: totalRequests } = await supabase
                .from("testimonial_requests")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id);

            if (testimonialData) {
                const avg = testimonialData.length > 0
                    ? testimonialData.reduce((acc, current) => acc + current.rating, 0) / testimonialData.length
                    : 0;
                setStats({ total: totalTestimonials || 0, requests: totalRequests || 0, avg });
            }

            setLoading(false);
        }

        getDashboardData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="space-y-10">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
                </div>
                <Skeleton className="h-96 rounded-[2.5rem]" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tight">Overview</h1>
                    <p className="text-muted-foreground font-medium">
                        Welcome back! You have collected <span className="text-primary font-bold">{stats.total}</span> testimonials so far.
                    </p>
                </div>
                <div className="flex gap-4">
                    <CreateLinkModal plan={profile?.plan} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Testimonials", value: stats.total, icon: MessageSquareQuote, color: "text-blue-500" },
                    { label: "Request Links", value: stats.requests, icon: TrendingUp, color: "text-green-500" },
                    { label: "Average Rating", value: `${stats.avg.toFixed(1)}/5`, icon: Star, color: "text-yellow-500" },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-lg rounded-3xl group hover:scale-[1.02] transition-transform">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-4xl font-black italic">{stat.value}</p>
                            </div>
                            <stat.icon className={`h-10 w-10 ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Dashboard Sections */}
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Recent Testimonials */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black italic">Recent Success Clips</h2>
                        <Link href="/dashboard/testimonials">
                            <Button variant="ghost" className="text-primary font-bold gap-2">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {testimonials.length === 0 ? (
                        <div className="bg-card border-2 border-dashed border-border/50 rounded-[2.5rem] p-16 text-center space-y-6">
                            <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquareQuote className="h-10 w-10 text-primary opacity-20" />
                            </div>
                            <h3 className="text-2xl font-bold">No testimonials yet</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                                Start your journey by creating a request link and sending it to your happy clients.
                            </p>
                            <CreateLinkModal plan={profile?.plan} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {testimonials.map((testimonial) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                    onDelete={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-8">
                    {/* Pro Teaser */}
                    {profile?.plan !== 'pro' && (
                        <Card className="bg-primary text-primary-foreground rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
                            <Zap className="absolute -top-6 -right-6 h-32 w-32 opacity-10" />
                            <div className="space-y-2 relative">
                                <Badge variant="secondary" className="bg-white/20 text-white border-none rounded-full px-4 mb-2 font-black italic uppercase tracking-widest text-[10px]">Upgrade to Pro</Badge>
                                <CardTitle className="text-3xl font-black italic tracking-tight">Unlock AI Insights</CardTitle>
                                <CardDescription className="text-primary-foreground/80 text-base font-medium"> Improve testimonials with AI, collect video/audio reviews, and get advanced analytics.</CardDescription>
                            </div>
                            <Link href="/dashboard/billing">
                                <Button variant="secondary" className="w-full h-14 rounded-2xl font-black italic uppercase tracking-widest shadow-lg">Upgrade Now</Button>
                            </Link>
                        </Card>
                    )}

                    {/* Quick Tips */}
                    <Card className="border-border/50 shadow-xl rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h3 className="text-xl font-bold italic">Quick Tips</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                "Add your logo to the public page.",
                                "Send a request immediately after delivery.",
                                "Embed the widget on your landing page.",
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                    <p className="text-sm font-medium text-muted-foreground">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
