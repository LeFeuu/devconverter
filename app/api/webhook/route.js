import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerEmail = session.customer_email

        // Trouver l'utilisateur par email
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single()

        if (profiles) {
          // Mettre à jour le profil avec is_pro = true
          await supabase
            .from('profiles')
            .update({
              is_pro: true,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            })
            .eq('id', profiles.id)

          console.log(`User ${customerEmail} upgraded to Pro`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Trouver l'utilisateur par subscription_id
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (profiles) {
          // Mettre à jour le profil avec is_pro = false
          await supabase
            .from('profiles')
            .update({ is_pro: false })
            .eq('id', profiles.id)

          console.log(`Subscription cancelled for user`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
