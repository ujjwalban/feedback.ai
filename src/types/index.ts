export type PlanType = 'free' | 'pro'

export interface UserProfile {
    id: string
    email: string
    username: string | null
    plan: PlanType
    created_at: string
}

export interface TestimonialRequest {
    id: string
    user_id: string
    slug: string
    allowed_type: 'text' | 'audio' | 'video'
    created_at: string
}

export interface Testimonial {
    id: string
    user_id: string
    request_id: string | null
    client_name: string
    rating: number
    message: string | null
    type: 'text' | 'audio' | 'video'
    audio_url: string | null
    video_url: string | null
    created_at: string
}
