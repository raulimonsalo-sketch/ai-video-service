import jwt from 'jsonwebtoken'

const KLING_API = 'https://api.klingai.com'

export type KlingPackage = 'starter' | 'creator' | 'studio'

function makeToken(): string {
  const accessKey = process.env.KLING_ACCESS_KEY
  const secretKey = process.env.KLING_SECRET_KEY
  if (!accessKey || !secretKey) throw new Error('KLING_ACCESS_KEY / KLING_SECRET_KEY not set')

  const now = Math.floor(Date.now() / 1000)
  return jwt.sign(
    { iss: accessKey, exp: now + 1800, nbf: now - 5 },
    secretKey,
    { algorithm: 'HS256', header: { alg: 'HS256', typ: 'JWT' } }
  )
}

function headers() {
  return {
    Authorization: `Bearer ${makeToken()}`,
    'Content-Type': 'application/json',
  }
}

export async function generateImage(prompt: string, callbackUrl: string): Promise<string> {
  const res = await fetch(`${KLING_API}/v1/images/text2image`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model_name: 'kling-v1',
      prompt,
      image_count: 1,
      callback_url: callbackUrl,
    }),
  })
  const data = await res.json()
  if (!res.ok || data.code !== 0) {
    throw new Error(`Kling image error: ${data.message || res.status}`)
  }
  return data.data.task_id as string
}

export async function generateVideo(
  prompt: string,
  pkg: 'creator' | 'studio',
  callbackUrl: string
): Promise<string> {
  const isStudio = pkg === 'studio'
  const res = await fetch(`${KLING_API}/v1/videos/text2video`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model_name: isStudio ? 'kling-v1-5' : 'kling-v1',
      prompt,
      mode: isStudio ? 'pro' : 'std',
      duration: isStudio ? '10' : '5',
      callback_url: callbackUrl,
    }),
  })
  const data = await res.json()
  if (!res.ok || data.code !== 0) {
    throw new Error(`Kling video error: ${data.message || res.status}`)
  }
  return data.data.task_id as string
}

export interface KlingCallbackBody {
  task_id: string
  task_status: 'submitted' | 'processing' | 'succeed' | 'failed'
  task_status_msg?: string
  task_result?: {
    videos?: Array<{ id: string; url: string; duration: string }>
    images?: Array<{ index: number; url: string }>
  }
}

export function extractMediaUrl(body: KlingCallbackBody): string | null {
  if (body.task_status !== 'succeed') return null
  const result = body.task_result
  if (!result) return null
  if (result.videos?.length) return result.videos[0].url
  if (result.images?.length) return result.images[0].url
  return null
}
