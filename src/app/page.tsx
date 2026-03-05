import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MessageSquareQuote, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <MessageSquareQuote className="h-6 w-6 text-primary" />
            <span>Feedback.ai</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
            <Link href="#testimonials" className="transition-colors hover:text-primary">Testimonials</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="font-medium rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center border-b">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted/50 text-muted-foreground mb-4">
              ✨ The easiest way to build trust
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl">
              Collect testimonials from clients in seconds.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] leading-relaxed">
              Automate your social proof. Feedback.ai gives freelancers and agencies a frictionless way to gather, manage, and showcase client reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-base rounded-full w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">No credit card required • Setup in 2 minutes</p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-muted/30 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to grow</h2>
              <p className="text-muted-foreground text-lg max-w-[600px]">Streamline your feedback collection process with our powerful tools designed specifically for freelancers.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "One-Click Requests",
                  description: "Generate unique links and send them to clients instantly. No login required for them.",
                  icon: <Link className="h-6 w-6 mb-4 text-primary" href={""} />
                },
                {
                  title: "Beautiful Public Pages",
                  description: "Showcase your best reviews on a hosted, beautifully designed public page automatically.",
                  icon: <Star className="h-6 w-6 mb-4 text-primary" />
                },
                {
                  title: "Rich Media Support",
                  description: "Go beyond text. Collect powerful audio and video testimonials to stand out.",
                  icon: <MessageSquareQuote className="h-6 w-6 mb-4 text-primary" />
                }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg max-w-[600px]">Start for free, upgrade when you need more power.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <Card className="flex flex-col rounded-3xl border-border/50 shadow-sm relative overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-bold">Hobby</CardTitle>
                  <CardDescription className="text-base mt-2">Perfect for getting started.</CardDescription>
                  <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                    $0
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-8 pt-4">
                  <ul className="space-y-4">
                    {["Unlimited text testimonials", "Basic public page", "Export as PDF"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full rounded-full h-12 text-base">Get Started Free</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="flex flex-col rounded-3xl border-primary shadow-lg relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-primary" />
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      Pro <Star className="h-5 w-5 fill-primary text-primary" />
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base mt-2">For serious freelancers and agencies.</CardDescription>
                  <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                    $20
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-8 pt-4">
                  <ul className="space-y-4">
                    {["Everything in free", "Video testimonials", "Audio testimonials", "Premium page designs", "Custom branding"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Link href="/signup" className="w-full">
                    <Button className="w-full rounded-full h-12 text-base shadow-md">Upgrade to Pro</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground border-y border-primary/20">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter max-w-[800px]">
              Ready to turn your happy clients into your best marketers?
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-[600px]">
              Join hundreds of freelancers building trust and winning more clients with Feedback.ai.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base rounded-full mt-4 font-semibold text-primary shadow-lg hover:shadow-xl transition-all">
                Start Collecting Testimonials
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 border-t bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5" />
            <span className="font-semibold text-foreground">Feedback.ai</span>
          </div>
          <p>© {new Date().getFullYear()} Feedback.ai. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
