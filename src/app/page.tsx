"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  MessageSquareQuote,
  Star,
  Zap,
  ShieldCheck,
  Users,
  Globe,
  ArrowRight,
  MousePointer2,
  Sparkles,
  Quote
} from "lucide-react";
import { AnimatedBrand } from "@/components/landing/AnimatedBrand";
import { LandingHero } from "@/components/landing/LandingHero";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/">
            <AnimatedBrand iconSize={24} textSize="text-xl md:text-2xl" />
          </Link>
          <nav className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
            <Link href="#features" className="transition-all hover:text-primary hover:tracking-[0.3em]">Features</Link>
            <Link href="#pricing" className="transition-all hover:text-primary hover:tracking-[0.3em]">Pricing</Link>
            <Link href="#testimonials" className="transition-all hover:text-primary hover:tracking-[0.3em]">Stories</Link>
          </nav>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="font-black italic uppercase tracking-widest rounded-2xl h-11 px-4 sm:px-8 shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_15px_25px_-5px_rgba(var(--primary-rgb),0.4)] transition-all active:scale-95">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <LandingHero />

        {/* Features Section - Premium Grid */}
        <section id="features" className="w-full py-32 bg-muted/20 border-y border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center space-y-6 mb-24">
              <Badge variant="outline" className="px-6 py-1.5 rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] italic">
                Platform Features
              </Badge>
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter italic">Built for <span className="text-primary underline decoration-primary/20">Hyper-Growth.</span></h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-[700px] font-medium leading-relaxed">Everything you need to automate your social proof and build indestructible trust with your audience.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "Frictionless Collection",
                  description: "Clients leave reviews without ever creating an account. 30 seconds and they're done.",
                  icon: <Zap className="h-6 w-6 text-yellow-500" />,
                  delay: 0.1
                },
                {
                  title: "Video & Audio Proof",
                  description: "Go beyond text. Let your clients record powerful video testimonials directly in their browser.",
                  icon: <Sparkles className="h-6 w-6 text-purple-500" />,
                  delay: 0.2
                },
                {
                  title: "Universal Wall of Love",
                  description: "A beautiful, hosted page that updates automatically every time you collect a new review.",
                  icon: <Globe className="h-6 w-6 text-blue-500" />,
                  delay: 0.3
                },
                {
                  title: "AI Optimized Text",
                  description: "Use our built-in AI to polish testimonials for maximum marketing impact without changing the meaning.",
                  icon: <MessageSquareQuote className="h-6 w-6 text-primary" />,
                  delay: 0.4
                },
                {
                  title: "Real-time Analytics",
                  description: "Track which links are converting and who is viewing your public landing page in real-time.",
                  icon: <Users className="h-6 w-6 text-green-500" />,
                  delay: 0.5
                },
                {
                  title: "One-Click Embed",
                  description: "Paste a single script on your site and show off your best reviews anywhere with zero maintenance.",
                  icon: <MousePointer2 className="h-6 w-6 text-orange-500" />,
                  delay: 0.6
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay, duration: 0.5 }}
                  className="group relative flex flex-col p-6 md:p-10 bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                >
                  <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black italic mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
                  <div className="mt-8 pt-8 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/signup" className="text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                      Experience it now <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section id="testimonials" className="py-32 container mx-auto px-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <Badge variant="outline" className="px-4 py-1 rounded-full text-indigo-500 border-indigo-500/20 font-black uppercase tracking-widest text-[10px]">Case Study</Badge>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight">
                "Feedback.ai doubled my <span className="text-primary">conversion rate</span> in 3 weeks."
              </h2>
              <p className="text-xl text-muted-foreground font-medium max-w-xl">
                Freelancers worldwide are throwing away their spreadsheets and automating their social proof strategy.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-16 w-16 bg-muted rounded-2xl overflow-hidden border-2 border-primary shadow-xl">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black italic text-lg uppercase tracking-tight">Alex Rivera</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Lead Product Designer</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
              <Card className="rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl p-6 md:p-10 rotate-3 hover:rotate-0 transition-transform duration-700 bg-background/80 backdrop-blur-xl">
                <Quote className="h-12 w-12 text-primary/10 mb-6" />
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-2xl font-black tracking-tight leading-snug italic mb-10">
                  "Before Feedback.ai, I had to hunt down clients for weeks. Now, I send one link and the testimonial lands in my dashboard by morning. It's magic."
                </p>
                <div className="h-px bg-border w-full mb-6" />
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase text-[10px] tracking-widest text-primary">Verified Success Story</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Feedback.ai Proof</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section - Ultra Premium */}
        <section id="pricing" className="w-full py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 mb-24">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic">Simple Pricing. <span className="text-white/40">Infinite Trust.</span></h2>
              <p className="text-primary-foreground/70 text-lg md:text-xl font-medium max-w-[600px]">Start for free, scale when you dominate your market.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <div className="flex flex-col p-8 md:p-12 bg-white/10 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] border border-white/20 shadow-2xl">
                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-widest">Hobbyist</h3>
                  <p className="text-primary-foreground/60 font-bold uppercase text-[10px] tracking-[0.2em]">Perfect for fresh starters</p>
                </div>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-7xl font-black italic">$0</span>
                  <span className="text-xl font-bold opacity-40 uppercase">/mo</span>
                </div>
                <div className="h-px bg-white/20 w-full mb-10" />
                <ul className="space-y-6 flex-1 mb-12">
                  {["Unlimited Text Testimonials", "Standard Public Wall", "Basic Dashboard", "Stripe Checkout Ready"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 font-bold text-sm tracking-tight text-white/80">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full">
                  <Button variant="secondary" className="w-full h-16 rounded-2xl font-black italic uppercase tracking-widest text-primary shadow-xl hover:shadow-white/10 transition-all">Get Started Free</Button>
                </Link>
              </div>

              <div className="flex flex-col p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] text-primary shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl rotate-6">Popular Plan</div>
                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-widest">Pro Founder</h3>
                  <p className="text-primary/60 font-bold uppercase text-[10px] tracking-[0.2em]">Scale your social proof strategy</p>
                </div>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-7xl font-black italic">$20</span>
                  <span className="text-xl font-bold opacity-40 uppercase">/mo</span>
                </div>
                <div className="h-px bg-primary/10 w-full mb-10" />
                <ul className="space-y-6 flex-1 mb-12">
                  {["Everything in Hobby", "Audio & Video Testimonials", "AI Testimonial Improver", "Shareable Image Generator", "One-Click Widget Embed", "Advanced Growth Analytics"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 font-bold text-sm tracking-tight text-primary/80">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-16 rounded-2xl font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">Go Professional</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-48 container mx-auto px-6 text-center space-y-12">
          <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter leading-tight max-w-5xl mx-auto">
            Ready to build the most <span className="text-primary italic">trusted brand</span> in your niche?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Join 500+ freelancers already turning testimonials into revenue using Feedback.ai.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-8"
          >
            <Link href="/signup">
              <Button size="lg" className="h-24 px-16 text-2xl rounded-[2.5rem] font-black italic uppercase tracking-widest shadow-2xl shadow-primary/30 gap-6 group">
                Start Collecting Now
                <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-50">NO CREDIT CARD REQUIRED • CANCEL ANYTIME</p>
        </section>
      </main>

      <footer className="w-full py-20 border-t bg-muted/20">
        <div className="container mx-auto px-6 flex flex-col items-center gap-12">
          <Link href="/">
            <AnimatedBrand iconSize={32} textSize="text-2xl md:text-3xl" />
          </Link>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Status</Link>
            <Link href="#" className="hover:text-primary">Twitter / X</Link>
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground/40">© {new Date().getFullYear()} Feedback.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

