"use client"

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Testimonial, Profile, UserProfile } from "@/types";
import { Star, MessageSquareQuote, CheckCircle2, Globe, Github, Twitter, Linkedin, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        async function getProfileData() {
            // Find user by username (case-insensitive)
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .ilike("username", username)
                .single();

            if (userError || !userData) {
                setLoading(false);
                return;
            }

            setUser(userData);

            // Fetch profile details
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userData.id)
                .single();

            setProfile(profileData);

            // Fetch testimonials
            const { data: testimonialData } = await supabase
                .from("testimonials")
                .select("*")
                .eq("user_id", userData.id)
                .order("created_at", { ascending: false });

            setTestimonials(testimonialData || []);
            setLoading(false);

            // Record analytics event
            await supabase.from("analytics_events").insert({
                user_id: userData.id,
                event_type: "page_view",
                metadata: { username: userData.username }
            });
        }

        getProfileData();
    }, [username, supabase]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-6 bg-muted/20">
                <div className="h-24 w-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                    <Github className="h-12 w-12" />
                </div>
                <h1 className="text-4xl font-black text-foreground italic">User Not Found</h1>
                <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
                <Link href="/"><Button size="lg" className="rounded-2xl">Back to Home</Button></Link>
            </div>
        );
    }

    const avgRating = testimonials.length > 0
        ? testimonials.reduce((acc, current) => acc + current.rating, 0) / testimonials.length
        : 0;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Elegant Header/Hero */}
            <header className="relative py-20 md:py-32 overflow-hidden border-b bg-muted/20">
                <div className="absolute inset-0 -z-10 opacity-30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto max-w-5xl px-6 relative">
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        <div className="relative group">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <Avatar className="h-40 w-40 md:h-52 md:w-52 border-4 border-background shadow-2xl relative">
                                <AvatarImage src={profile?.avatar_url || ""} />
                                <AvatarFallback className="text-5xl font-black bg-muted">
                                    {username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight">{profile?.full_name || username}</h1>
                                <p className="text-2xl font-bold text-primary italic uppercase tracking-wider">
                                    {profile?.headline || "Freelancer"}
                                </p>
                            </div>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                                {profile?.bio || `I help clients build amazing things. Check out what they have to say about working with me.`}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {profile?.skills?.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 pt-4 border-t border-border/50">
                                {profile?.social_links?.twitter && (
                                    <Link href={profile.social_links.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Twitter className="h-6 w-6" />
                                    </Link>
                                )}
                                {profile?.social_links?.linkedin && (
                                    <Link href={profile.social_links.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Linkedin className="h-6 w-6" />
                                    </Link>
                                )}
                                {profile?.website && (
                                    <Link href={profile.website} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Globe className="h-6 w-6" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Highlights */}
            <section className="-mt-10 relative z-10">
                <div className="container mx-auto max-w-4xl px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { label: "Total Testimonials", value: testimonials.length, icon: MessageSquareQuote },
                            { label: "Average Rating", value: `${avgRating.toFixed(1)}/5`, icon: Star },
                            { label: "Verified Reviews", value: "100%", icon: CheckCircle2 },
                        ].map((stat, i) => (
                            <div key={i} className="bg-card border border-border/50 shadow-xl rounded-3xl p-6 flex flex-col items-center text-center gap-2">
                                <stat.icon className="h-5 w-5 text-primary mb-1" />
                                <p className="text-2xl md:text-3xl font-black">{stat.value}</p>
                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Wall */}
            <main className="py-24 md:py-32 container mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-20">
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">Wall of Love</h2>
                    <div className="h-1.5 w-24 bg-primary rounded-full" />
                </div>

                {testimonials.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
                        <h3 className="text-2xl font-bold mb-2">No testimonials yet</h3>
                        <p className="text-muted-foreground">Keep an eye on this space! Something big is coming.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.id} className="border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col group bg-card/50 backdrop-blur-sm">
                                <CardHeader className="pt-10 px-10 pb-6 relative">
                                    <Quote className="absolute top-6 right-8 h-12 w-12 text-primary/5 -z-0" />
                                    <div className="flex gap-1.5 z-10 relative">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                                            />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-10 pb-10 flex-1 relative z-10">
                                    <p className="text-lg md:text-xl font-medium leading-relaxed italic text-foreground/90 transition-colors group-hover:text-foreground">
                                        "{testimonial.improved_text || testimonial.message}"
                                    </p>
                                </CardContent>
                                <CardFooter className="bg-muted/30 px-10 py-8 flex items-center justify-between border-t border-border/50 group-hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 border-2 border-primary/20 rounded-full flex items-center justify-center font-black text-primary text-lg bg-background shadow-inner">
                                            {testimonial.client_name[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm tracking-tight">{testimonial.client_name}</span>
                                            {testimonial.client_company && (
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                                                    <Building2 className="h-2.5 w-2.5" />
                                                    {testimonial.client_company}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0 border-primary/20 text-primary">
                                            {new Date(testimonial.created_at).getFullYear()}
                                        </Badge>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <footer className="w-full py-20 border-t bg-muted/20 text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                    <MessageSquareQuote className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-black italic">Feedback.ai</span>
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Build Trust. Automate Social Proof.</p>
                <div className="pt-6">
                    <Link href="/signup">
                        <Button variant="outline" className="rounded-full h-12 px-8 border-primary/20 hover:bg-primary/5">
                            Create Your Own Wall of Love
                        </Button>
                    </Link>
                </div>
            </footer>
        </div>
    );
}

function Quote({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9125 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V5C10.017 4.44772 10.4647 4 11.017 4H19.017C20.6739 4 22.017 5.34315 22.017 7V15C22.017 18.866 18.883 22 15.017 22L14.017 21ZM4.017 21L4.017 18C4.017 16.8954 4.91246 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12C4.017 12.5523 3.56928 13 3.017 13H1.017C0.464722 13 1.7423e-08 12.5523 0 12V5C-1.7423e-08 4.44772 0.464722 4 1.017 4H9.017C10.6739 4 12.017 5.34315 12.017 7V15C12.017 18.866 8.88301 22 5.017 22L4.017 21Z" />
        </svg>
    );
}
