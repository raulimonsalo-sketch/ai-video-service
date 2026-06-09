import Anthropic from '@anthropic-ai/sdk'

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey: key })
}

export async function refinePrompt(
  description: string,
  style: string,
  mediaType: 'video' | 'image'
): Promise<string> {
  const systemPrompt =
    mediaType === 'video'
      ? `You are an expert cinematographer and AI video prompt engineer. Transform the user's description into an optimised Kling AI video generation prompt.

Rules:
- Start with the main subject and action
- Add cinematic camera movement (e.g. "slow dolly in", "aerial tracking shot", "handheld close-up")
- Include lighting details (golden hour, soft diffused light, high contrast, etc.)
- Add mood and atmosphere words
- Include technical quality cues: "8K", "cinematic", "photorealistic", "film grain", "bokeh", "shallow depth of field"
- Keep the final prompt under 300 words
- Output ONLY the refined prompt — no explanations, no labels, no preamble`
      : `You are an expert photographer and AI image prompt engineer. Transform the user's description into an optimised Kling AI image generation prompt.

Rules:
- Lead with subject and composition
- Add lighting details (studio lighting, natural window light, dramatic shadows, etc.)
- Include photographic style (DSLR, 35mm film, macro, portrait, wide-angle, etc.)
- Add quality cues: "ultra-detailed", "8K", "photorealistic", "sharp focus", "professional photography"
- Keep the final prompt under 200 words
- Output ONLY the refined prompt — no explanations, no labels, no preamble`

  const userMessage = style
    ? `Description: ${description}\n\nStyle notes: ${style}`
    : `Description: ${description}`

  const message = await getClient().messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected Claude response type')
  return block.text.trim()
}
