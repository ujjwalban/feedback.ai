import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('STRIPE_SECRET_KEY is missing in production!')
    }
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock')
