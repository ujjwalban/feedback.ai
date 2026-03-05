"use client"

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Testimonial } from "@/types";
import { Star, MessageSquareQuote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

export default function EmbedWidgetPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const supabase = createClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTestimonials() {
            const { data: userData } = await supabase
                .from("users")
                .select("id")
                .eq("username", username)
                .single();

            if (!userData) return;

            const { data } = await supabase
                .from("testimonials")
                .select("*")
                .eq("user_id", userData.id)
                .order("created_at", { ascending: false });

            setTestimonials(data || []);
            setLoading(false);
        }
        fetchTestimonials();
    }, [username, supabase]);

    if (loading || testimonials.length === 0) return null;

    return (
        <div className="bg-transparent overflow-hidden p-4">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="w-full max-w-lg mx-auto"
            >
                <CarouselContent>
                    {testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.id}>
                            <div className="p-1">
                                <Card className="border-none shadow-md bg-white rounded-2xl">
                                    <CardContent className="flex flex-col p-6 space-y-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed italic text-foreground">
                                            "{testimonial.message}"
                                        </p>
                                        <div className="flex items-center gap-3 border-t pt-4">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                {testimonial.client_name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">{testimonial.client_name}</span>
                                                {testimonial.client_company && (
                                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">{testimonial.client_company}</span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden sm:block">
                    <CarouselPrevious className="-left-12" />
                    <CarouselNext className="-right-12" />
                </div>
            </Carousel>
            <div className="text-center mt-2">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    Verified by Feedback.ai
                </p>
            </div>
        </div>
    );
}
