"use client"

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { TestimonialRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquareQuote, CheckCircle2, ShieldCheck, Loader2, Video, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MediaRecorderModal } from "@/components/MediaRecorderModal";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    company: z.string().optional(),
    rating: z.number().min(1).max(5),
    message: z.string().min(10, "Message must be at least 10 characters").optional(),
});

export default function TestimonialSubmissionPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const supabase = createClient();
    const router = useRouter();
    const [request, setRequest] = useState<TestimonialRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [recorderOpen, setRecorderOpen] = useState(false);
    const [recorderType, setRecorderType] = useState<'audio' | 'video'>('audio');
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'audio' | 'video' | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: 5,
        }
    });

    useEffect(() => {
        async function fetchRequest() {
            const { data, error } = await supabase
                .from("testimonial_requests")
                .select(`
          *,
          users (
            username,
            plan
          )
        `)
                .eq("slug", token)
                .single();

            if (error || !data) {
                setLoading(false);
                return;
            }

            setRequest(data);

            // Track view
            await supabase.rpc('increment_request_views', { request_id: data.id });

            setLoading(false);
        }

        fetchRequest();
    }, [token, supabase]);

    const handleMediaUpload = async (blob: Blob, type: 'audio' | 'video') => {
        if (!request) throw new Error('No request found');

        const fileName = `${request.user_id}/${Date.now()}-${type}`;
        const bucketName = type === 'audio' ? 'audio-testimonials' : 'video-testimonials';

        const { error, data } = await supabase.storage
            .from(bucketName)
            .upload(fileName, blob, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

        setMediaUrl(publicUrl);
        setMediaType(type);
        setRecorderOpen(false);

        toast.success(`${type === 'audio' ? 'Audio' : 'Video'} recorded and uploaded successfully`);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Validate that either message or media was provided
        if (!mediaType && !values.message) {
            toast("Feedback.ai", { description: "Please provide either a text message or record audio/video." });
            return;
        }

        setSubmitting(true);

        if (!request) return;

        // If media was recorded, use it; otherwise use the text message
        const testimonialData = {
            user_id: request.user_id,
            request_id: request.id,
            client_name: values.name,
            client_company: values.company,
            rating: values.rating,
            message: mediaType ? null : values.message,
            type: mediaType || 'text',
            ...(mediaType === 'audio' && { audio_url: mediaUrl }),
            ...(mediaType === 'video' && { video_url: mediaUrl }),
        };

        const { error } = await supabase
            .from("testimonials")
            .insert([testimonialData]);

        if (!error) {
            // Track submission
            await supabase.rpc('increment_request_submissions', { request_id: request.id });
            router.push("/thank-you");
        } else {
            toast("Feedback.ai", { description: "Something went wrong. Please try again." });
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 space-y-4">
                    <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Link Invalid or Expired</CardTitle>
                    <CardDescription>
                        This testimonial request link is no longer active. Please contact the person who shared it with you.
                    </CardDescription>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/")}>Go Home</Button>
                </Card>
            </div>
        );
    }

    const user = (request as any).users;

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 md:py-20">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm">
                            <MessageSquareQuote className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave a testimonial for {user?.username}</h1>
                    <p className="text-muted-foreground">
                        {request.description || "Your feedback helps us improve and grow. Thank you for your support!"}
                    </p>
                </div>

                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground p-8">
                        <CardTitle className="text-xl">Share your experience</CardTitle>
                        <CardDescription className="text-primary-foreground/80">It won't take more than a minute.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Jane Doe"
                                        className="rounded-xl h-11"
                                        {...register("name")}
                                    />
                                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company (Optional)</Label>
                                    <Input
                                        id="company"
                                        placeholder="Acme Inc."
                                        className="rounded-xl h-11"
                                        {...register("company")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Rating</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="transition-transform active:scale-90"
                                            onClick={() => {
                                                setRating(star);
                                                setValue("rating", star);
                                            }}
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Your Testimonial</Label>
                                {mediaType ? (
                                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 space-y-2">
                                        <p className="text-sm text-green-600 font-semibold">
                                            {mediaType === 'audio' ? '🎤 Audio' : '🎥 Video'} recorded and uploaded
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setMediaType(null);
                                                setMediaUrl(null);
                                            }}
                                            className="text-destructive hover:bg-destructive/10"
                                        >
                                            Change to text
                                        </Button>
                                    </div>
                                ) : (
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us what you liked most about working with us..."
                                        className="min-h-[120px] rounded-2xl resize-none p-4"
                                        {...register("message")}
                                    />
                                )}
                                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                            </div>

                            {user?.plan === 'pro' && (
                                <div className="pt-4 border-t space-y-4">
                                    <Label className="text-sm font-semibold opacity-70">Optional formats</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-16 rounded-2xl gap-2 flex-col"
                                            onClick={() => {
                                                setRecorderType('video');
                                                setRecorderOpen(true);
                                            }}
                                        >
                                            <Video className="h-5 w-5" />
                                            <span className="text-xs">Record Video</span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-16 rounded-2xl gap-2 flex-col"
                                            onClick={() => {
                                                setRecorderType('audio');
                                                setRecorderOpen(true);
                                            }}
                                        >
                                            <Mic className="h-5 w-5" />
                                            <span className="text-xs">Record Audio</span>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Testimonial"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex justify-center items-center gap-2 text-muted-foreground/60 text-sm">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secured by Feedback.ai</span>
                </div>

                <MediaRecorderModal
                    open={recorderOpen}
                    onClose={() => setRecorderOpen(false)}
                    onUpload={handleMediaUpload}
                    type={recorderType}
                />
            </div>
        </div>
    );
}
