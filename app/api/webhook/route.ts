import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { refinePrompt } from '@/lib/claude'
import { generateImage, generateVideo } from '@/lib/kling'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' })
}

// Stripe requires the raw body for signature verification — don't use NextResponse.json parsing here
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const meta = session.metadata ?? {}

  const customerName = meta.customerName ?? 'Customer'
  const customerEmail = meta.customerEmail ?? session.customer_details?.email ?? ''
  const pkg = (meta.package ?? 'starter') as 'starter' | 'creator' | 'studio'
  const description = meta.description ?? ''
  const style = meta.style ?? ''

  if (!customerEmail || !description) {
    console.error('[webhook] missing email or description in metadata', meta)
    return NextResponse.json({ received: true })
  }

  const mediaType: 'video' | 'image' = pkg === 'starter' ? 'image' : 'video'

  try {
    // Refine the prompt with Claude
    const refinedPrompt = await refinePrompt(description, style, mediaType)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
    const callbackParams = new URLSearchParams({
      email: customerEmail,
      name: customerName,
      pkg,
      mediaType,
      prompt: refinedPrompt.slice(0, 400),
    })
    const callbackUrl = `${baseUrl}/api/kling-callback?${callbackParams.toString()}`

    // Submit to Kling AI
    if (pkg === 'starter') {
      await generateImage(refinedPrompt, callbackUrl)
    } else {
      await generateVideo(refinedPrompt, pkg, callbackUrl)
    }

    console.log(`[webhook] generation started for ${customerEmail}, package=${pkg}`)
  } catch (err) {
    // Log the error but still return 200 so Stripe doesn't retry
    // In production you'd want a dead-letter queue or alerting here
    console.error('[webhook] generation error:', err)
  }

  return NextResponse.json({ received: true })
}
