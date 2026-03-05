export type PlanType = 'free' | 'pro'

export interface UserProfile {
    id: string
    email: string
    username: string | null
    plan: PlanType
    created_at: string
    avatar_url?: string | null
}

export interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    headline: string | null
    skills: string[]
    website: string | null
    social_links: Record<string, string>
    updated_at: string
}

export interface TestimonialRequest {
    id: string
    user_id: string
    slug: string
    title?: string
    description?: string
    view_count: number
    submission_count: number
    created_at: string
}

export interface Testimonial {
    id: string
    user_id: string
    request_id: string | null
    client_name: string
    client_company?: string | null
    rating: number
    message: string | null
    original_text?: string | null
    improved_text?: string | null
    type: 'text' | 'audio' | 'video'
    audio_url: string | null
    video_url: string | null
    is_featured: boolean
    created_at: string
}

export interface AnalyticsEvent {
    id: string
    user_id: string
    event_type: 'link_open' | 'submission' | 'page_view'
    metadata: any
    created_at: string
}
