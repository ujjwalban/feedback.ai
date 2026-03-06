"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types";
import {
    CreditCard,
    CheckCircle2,
    Star,
    ShieldCheck,
    Zap,
    Clock,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function BillingPage() {
    const supabase = createClient();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                setUser(data);
            }
            setLoading(false);
        }
        getUser();
    }, [supabase]);

    const plans = [
        {
            name: "Free Plan",
            price: "$0",
            description: "Perfect for exploring the platform.",
            features: [
                "Text testimonials only",
                "Basic dashboard",
                "Standard public page",
                "Export as PDF"
            ],
            current: user?.plan === 'free',
            buttonText: "Current Plan",
            variant: "outline" as const
        },
        {
            name: "Pro Plan",
            price: "$20",
            description: "For serious freelancers and founders.",
            features: [
                "Audio testimonials",
                "Video testimonials",
                "AI Testimonial Improver",
                "Testimonial image generator",
                "Website embed widget",
                "Advanced analytics"
            ],
            current: user?.plan === 'pro',
            buttonText: user?.plan === 'pro' ? "Current Plan" : "Upgrade to Pro",
            variant: "default" as const,
            highlight: true
        }
    ];

    const handleUpgrade = async () => {
        toast("FeedBack.ai", { description: "Redirecting to Stripe Checkout..." });
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to create checkout session");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleManageSubscription = async () => {
        toast("FeedBack.ai", { description: "Opening subscription portal..." });
        try {
            const res = await fetch('/api/portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Unable to open subscription portal");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
                </div>
                <p className="text-muted-foreground ml-11">
                    Manage your subscription and upgrade to unlock premium features.
                </p>
            </div>

            {user?.plan === 'pro' && (
                <Card className="bg-primary/5 border-primary/20 rounded-3xl overflow-hidden shadow-sm">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">You are on the Pro Plan</h3>
                                <p className="text-sm text-muted-foreground font-medium">Your next billing date is April 1, 2024</p>
                            </div>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold h-11 px-8" onClick={handleManageSubscription}>Manage Subscription</Button>
                    </CardContent>
                </Card>
            )}

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
                {plans.map((plan, i) => (
                    <Card
                        key={i}
                        className={`flex flex-col rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 scale-100 ${plan.highlight ? "border-primary shadow-2xl shadow-primary/10 -translate-y-2" : "border-border/50 shadow-xl"
                            }`}
                    >
                        {plan.highlight && (
                            <div className="bg-primary px-6 py-2 text-primary-foreground text-center text-xs font-black uppercase tracking-widest">
                                Most Popular & Recommended
                            </div>
                        )}
                        <CardHeader className="p-10 pb-6 text-center space-y-4">
                            <div className="flex justify-center">
                                <Badge variant={plan.highlight ? "default" : "secondary"} className="h-6 px-4 rounded-full uppercase text-[10px] font-black tracking-widest">
                                    {plan.name}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-5xl font-black italic">
                                    {plan.price}
                                    <span className="text-xl font-bold text-muted-foreground not-italic">/mo</span>
                                </CardTitle>
                                <CardDescription className="text-base font-medium">{plan.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 flex-1">
                            <div className="h-px bg-border w-full mb-8" />
                            <ul className="space-y-5">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-4 group">
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${plan.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-foreground/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="p-10 pt-0">
                            <Button
                                onClick={plan.name === "Pro Plan" ? handleUpgrade : undefined}
                                className={`w-full h-14 rounded-2xl text-base font-black italic uppercase tracking-widest transition-all ${plan.current ? "bg-muted text-muted-foreground" : "shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
                                    }`}
                                disabled={plan.current}
                                variant={plan.variant}
                            >
                                {plan.buttonText}
                                {!plan.current && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center shadow-lg">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold italic">Secure Payments</h3>
                        <p className="text-sm text-muted-foreground font-medium">All payments are processed securely by Stripe. We never store your card details.</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" width={80} height={32} className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" />
                </div>
            </div>
        </div>
    );
}
