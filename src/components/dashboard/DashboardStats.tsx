import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareQuote, Star, Users } from "lucide-react"

interface DashboardStatsProps {
    totalTestimonials: number
    totalRequests: number
    avgRating: number
}

export function DashboardStats({ totalTestimonials, totalRequests, avgRating }: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
                    <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTestimonials}</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
            </Card>
            <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalRequests}</div>
                    <p className="text-xs text-muted-foreground">3 links active</p>
                </CardContent>
            </Card>
            <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground fill-primary/20" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgRating.toFixed(1)} / 5.0</div>
                    <p className="text-xs text-muted-foreground">Based on all feedback</p>
                </CardContent>
            </Card>
        </div>
    )
}
