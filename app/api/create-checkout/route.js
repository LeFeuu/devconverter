import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    // Vérifier que Stripe est bien configuré
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const { priceId } = await request.json()
    
    console.log('Creating checkout session for price:', priceId)

    const { priceId, email } = await request.json()
    
    console.log('Creating checkout session for:', email)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devconverter-black.vercel.app'}/converter?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devconverter-black.vercel.app'}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
