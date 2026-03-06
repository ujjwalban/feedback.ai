"use client"

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { TestimonialList } from "@/components/dashboard/TestimonialList";
import { Testimonial, PlanType } from "@/types";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLinkModal } from "@/components/dashboard/CreateLinkModal";
import { toast } from "sonner";

const PAGE_SIZE = 12;

export default function TestimonialsPage() {
    const supabase = createClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [userPlan, setUserPlan] = useState<PlanType>("free");
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchTestimonials = useCallback(async (pageNum: number, append = false) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (pageNum === 0) {
            const { data: profile } = await supabase
                .from("users")
                .select("plan")
                .eq("id", user.id)
                .single();
            setUserPlan((profile?.plan as PlanType) || "free");
        }

        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (!error && data) {
            if (append) {
                setTestimonials(prev => [...prev, ...data]);
            } else {
                setTestimonials(data);
            }
            setHasMore(data.length === PAGE_SIZE);
        }
    }, [supabase]);

    useEffect(() => {
        async function init() {
            await fetchTestimonials(0);
            setLoading(false);
        }
        init();
    }, [fetchTestimonials]);

    const loadMore = async () => {
        const nextPage = page + 1;
        setLoadingMore(true);
        await fetchTestimonials(nextPage, true);
        setPage(nextPage);
        setLoadingMore(false);
    };

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
            toast("FeedBack.ai", { description: "AI Improvement is a Pro feature. Please upgrade!" });
            return;
        }

        const testimonial = testimonials.find(t => t.id === id);
        if (!testimonial || !testimonial.message) return;

        toast("FeedBack.ai", { description: `Improving testimonial from ${testimonial.client_name} with AI...` });

        // Mock update — replace with real AI API call when integrated
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
                    <CreateLinkModal plan={userPlan} />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-3xl" />
                    ))}
                </div>
            ) : (
                <>
                    <TestimonialList
                        testimonials={testimonials}
                        onDelete={handleDelete}
                        onImprove={handleImprove}
                    />
                    {hasMore && testimonials.length > 0 && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                className="rounded-2xl h-12 px-8 font-bold"
                                onClick={loadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
