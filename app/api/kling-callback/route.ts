import { NextRequest, NextResponse } from 'next/server'
import { extractMediaUrl, KlingCallbackBody } from '@/lib/kling'
import { sendMediaEmail } from '@/lib/email'

const PACKAGE_LABELS: Record<string, string> = {
  starter: 'Starter',
  creator: 'Creator',
  studio: 'Studio',
}

export async function POST(req: NextRequest) {
  // Parse query params (our order data) and body (Kling's task result)
  const { searchParams } = req.nextUrl
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const pkg = searchParams.get('pkg') ?? 'starter'
  const mediaType = (searchParams.get('mediaType') ?? 'image') as 'video' | 'image'
  const refinedPrompt = searchParams.get('prompt') ?? ''

  if (!email || !name) {
    return NextResponse.json({ error: 'Missing order params' }, { status: 400 })
  }

  let body: KlingCallbackBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  console.log(`[kling-callback] task_id=${body.task_id} status=${body.task_status} email=${email}`)

  // Kling may call us multiple times with intermediate statuses — only act on success
  if (body.task_status !== 'succeed') {
    return NextResponse.json({ received: true })
  }

  const mediaUrl = extractMediaUrl(body)
  if (!mediaUrl) {
    console.error('[kling-callback] no media URL in payload', body)
    return NextResponse.json({ error: 'No media URL' }, { status: 422 })
  }

  try {
    await sendMediaEmail({
      to: email,
      customerName: name,
      mediaUrl,
      mediaType,
      refinedPrompt,
      packageName: PACKAGE_LABELS[pkg] ?? pkg,
    })
    console.log(`[kling-callback] email sent to ${email}`)
  } catch (err) {
    console.error('[kling-callback] email send failed:', err)
    // Return 500 so Kling retries the callback (if they support retries)
    return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
