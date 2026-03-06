import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not set')
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Webhook signature verification failed: ${message}`)
        return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const userId = session.metadata?.userId
                const subscriptionId = session.subscription as string

                if (!userId || !subscriptionId) {
                    console.error('Missing userId or subscriptionId in checkout session')
                    break
                }

                // Retrieve full subscription details
                const subscription = await stripe.subscriptions.retrieve(subscriptionId)

                // Upsert subscription record
                await supabaseAdmin.from('subscriptions').upsert({
                    id: subscription.id,
                    user_id: userId,
                    status: subscription.status,
                    price_id: subscription.items.data[0]?.price.id ?? null,
                    quantity: subscription.items.data[0]?.quantity ?? 1,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    created: new Date(subscription.created * 1000).toISOString(),
                    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
                    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
                    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
                    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
                    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
                })

                // Upgrade user plan to pro
                await supabaseAdmin
                    .from('users')
                    .update({ plan: 'pro' })
                    .eq('id', userId)

                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription

                // Find user by subscription
                const { data: existingSub } = await supabaseAdmin
                    .from('subscriptions')
                    .select('user_id')
                    .eq('id', subscription.id)
                    .single()

                if (!existingSub) {
                    console.error(`No subscription found for id: ${subscription.id}`)
                    break
                }

                // Update subscription record
                await supabaseAdmin.from('subscriptions').update({
                    status: subscription.status,
                    price_id: subscription.items.data[0]?.price.id ?? null,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
                    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
                    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
                }).eq('id', subscription.id)

                // Update plan based on subscription status
                const isActive = ['active', 'trialing'].includes(subscription.status)
                await supabaseAdmin
                    .from('users')
                    .update({ plan: isActive ? 'pro' : 'free' })
                    .eq('id', existingSub.user_id)

                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                const { data: existingSub } = await supabaseAdmin
                    .from('subscriptions')
                    .select('user_id')
                    .eq('id', subscription.id)
                    .single()

                if (!existingSub) {
                    console.error(`No subscription found for id: ${subscription.id}`)
                    break
                }

                // Mark subscription as canceled
                await supabaseAdmin.from('subscriptions').update({
                    status: 'canceled',
                    ended_at: new Date().toISOString(),
                }).eq('id', subscription.id)

                // Downgrade user to free
                await supabaseAdmin
                    .from('users')
                    .update({ plan: 'free' })
                    .eq('id', existingSub.user_id)

                break
            }

            default:
                // Unhandled event type — log but don't error
                console.log(`Unhandled event type: ${event.type}`)
        }
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
