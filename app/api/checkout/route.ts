import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' })
}

const PRICES: Record<string, number> = {
  starter: 2900,
  creator: 7900,
  studio: 19900,
}

const PACKAGE_NAMES: Record<string, string> = {
  starter: 'Starter — 1 AI Image',
  creator: 'Creator — 1 AI Video (5 sec)',
  studio: 'Studio — 1 AI Video (10 sec, Pro)',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, description, style, package: pkg } = body as {
      name: string
      email: string
      description: string
      style: string
      package: string
    }

    if (!name || !email || !description || !pkg || !PRICES[pkg]) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: PRICES[pkg],
            product_data: {
              name: PACKAGE_NAMES[pkg],
              description: 'AI-generated media delivered to your email',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName: name.slice(0, 100),
        customerEmail: email.slice(0, 254),
        package: pkg,
        description: description.slice(0, 490),
        style: style ? style.slice(0, 190) : '',
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
