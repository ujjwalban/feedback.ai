import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Find the Stripe customer by email
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1,
        })

        if (customers.data.length === 0) {
            return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Portal error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
