"use client"

import { motion } from "framer-motion";
import { AnimatedBrand } from "./AnimatedBrand";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, MessageSquare } from "lucide-react";

export function LandingHero() {
    return (
        <section className="relative w-full py-24 md:py-32 lg:py-48 flex items-center justify-center overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px]"
                />
            </div>

            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-1.5 text-sm font-bold bg-primary/5 text-primary mb-4 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Trusted by 5,000+ Freelancers
                </motion.div>

                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative"
                    >
                        {/* Animated Ring Background */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary opacity-30"
                            style={{ width: '320px', height: '320px', left: '-136px', top: '-136px' }}
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-2 border-transparent border-b-primary border-l-primary opacity-20"
                            style={{ width: '360px', height: '360px', left: '-156px', top: '-156px' }}
                        />

                        <AnimatedBrand
                            iconSize={48}
                            textSize="text-3xl sm:text-5xl md:text-8xl lg:text-9xl"
                            className="justify-center mb-8"
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl italic"
                    >
                        Turn Your Happy Clients into Your <span className="text-primary underline decoration-wavy underline-offset-8">Best Sales Team.</span>
                    </motion.h1>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-2xl text-muted-foreground max-w-[750px] leading-relaxed font-medium"
                >
                    The easiest way to collect, manage, and showcase testimonials that actually convert. Done in minutes, not hours.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-12"
                >
                    <Link href="/signup">
                        <Button size="lg" className="h-16 px-10 text-lg rounded-2xl w-full sm:w-auto shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 font-black italic uppercase tracking-widest gap-2">
                            Start Free Today
                            <ArrowRight className="h-6 w-6" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl w-full sm:w-auto border-2 font-bold backdrop-blur-sm bg-background/50">
                            See How It Works
                        </Button>
                    </Link>
                </motion.div>

                {/* Floating elements for more juice */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[5%] top-[20%] hidden xl:block"
                >
                    <div className="bg-card p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                            <Star fill="currentColor" size={20} />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="font-bold">5.0 Rating</p>
                            <p className="text-[10px] text-muted-foreground font-bold">BY REAL CLIENTS</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute right-[5%] bottom-[20%] hidden xl:block"
                >
                    <div className="bg-card p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <MessageSquare size={20} />
                        </div>
                        <div className="text-left leading-tight">
                            <p className="font-bold">Viral Page</p>
                            <p className="text-[10px] text-muted-foreground font-bold">100% AUTOMATED</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
