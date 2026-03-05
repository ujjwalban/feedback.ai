import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    try {
        const { userId, email } = await req.json()

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID!, // $20/month price ID
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
            customer_email: email,
            metadata: {
                userId,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
