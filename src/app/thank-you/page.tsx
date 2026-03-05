"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquareQuote, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden">
            {/* Background blobs for aesthetics */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-card border border-border/50 shadow-2xl rounded-[2.5rem] p-10 text-center space-y-8 relative"
            >
                <div className="flex justify-center">
                    <div className="h-24 w-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight text-foreground italic">Thank you!</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Your testimonial has been successfully submitted. It means a lot!
                    </p>
                </div>

                <div className="py-8 px-6 bg-muted/30 rounded-3xl border border-dashed border-primary/30 space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Viral Marketing</span>
                        <Star className="h-4 w-4 fill-primary text-primary" />
                    </div>
                    <p className="text-sm font-medium">Collected using <span className="text-primary font-bold">Feedback.ai</span></p>
                    <div className="h-px bg-border w-1/2 mx-auto" />
                    <p className="text-base font-bold">Collect testimonials from your own clients in seconds.</p>

                    <Link href="/signup" className="block w-full pt-4">
                        <Button size="lg" className="w-full h-14 rounded-2xl text-base font-bold gap-2 shadow-xl hover:shadow-primary/20 transition-all group">
                            Create Your Free Page
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-medium">
                    <MessageSquareQuote className="h-4 w-4" />
                    <span>Join 500+ freelancers growing with us</span>
                </div>
            </motion.div>

            <div className="mt-12 text-muted-foreground/40 font-bold text-sm tracking-tighter uppercase">
                Feedback.ai
            </div>
        </div>
    );
}
