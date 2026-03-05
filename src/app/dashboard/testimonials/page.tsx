"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TestimonialList } from "@/components/dashboard/TestimonialList";
import { Testimonial } from "@/types";
import { MessageSquare, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLinkModal } from "@/components/dashboard/CreateLinkModal";

export default function TestimonialsPage() {
    const supabase = createClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [userPlan, setUserPlan] = useState<string>("free");

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("users")
                .select("plan")
                .eq("id", user.id)
                .single();

            setUserPlan(profile?.plan || "free");

            const { data } = await supabase
                .from("testimonials")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            setTestimonials(data || []);
            setLoading(false);
        }

        fetchData();
    }, [supabase]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("testimonials")
            .delete()
            .eq("id", id);

        if (!error) {
            setTestimonials(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleImprove = async (id: string) => {
        if (userPlan !== "pro") {
            alert("AI Improvement is a Pro feature. Please upgrade!");
            return;
        }

        // Simulate AI Improvement (In real app, this would call an API route)
        const testimonial = testimonials.find(t => t.id === id);
        if (!testimonial || !testimonial.message) return;

        alert(`Improving testimonial from ${testimonial.client_name} with AI...`);

        // Mock update
        const improvedText = `${testimonial.message} (Optimized for impact by Feedback.ai)`;

        const { error } = await supabase
            .from("testimonials")
            .update({ improved_text: improvedText })
            .eq("id", id);

        if (!error) {
            setTestimonials(prev => prev.map(t =>
                t.id === id ? { ...t, improved_text: improvedText } : t
            ));
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
                    </div>
                    <p className="text-muted-foreground ml-11">
                        Manage your collected reviews and turn them into social proof.
                    </p>
                </div>

                <div className="flex gap-4">
                    <CreateLinkModal plan={userPlan as any} />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-3xl" />
                    ))}
                </div>
            ) : (
                <TestimonialList
                    testimonials={testimonials}
                    onDelete={handleDelete}
                    onImprove={handleImprove}
                />
            )}
        </div>
    );
}
