import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star, Trash2, Video, Mic, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Testimonial } from "@/types"

interface TestimonialCardProps {
    testimonial: Testimonial
    onDelete?: (id: string) => void
}

export function TestimonialCard({ testimonial, onDelete }: TestimonialCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
            <CardHeader className="pb-2 space-y-1">
                <div className="flex justify-between items-start">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                                    }`}
                            />
                        ))}
                    </div>
                    {testimonial.type === 'video' && <Video className="h-4 w-4 text-primary" />}
                    {testimonial.type === 'audio' && <Mic className="h-4 w-4 text-primary" />}
                    {testimonial.type === 'text' && <Quote className="h-4 w-4 text-muted-foreground" />}
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <p className="text-sm text-foreground line-clamp-4 italic leading-relaxed">
                    "{testimonial.message}"
                </p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center text-xs">
                <div className="font-semibold text-muted-foreground">
                    — {testimonial.client_name}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete?.(testimonial.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
