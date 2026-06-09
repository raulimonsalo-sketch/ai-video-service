import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

const FROM = () => process.env.EMAIL_FROM ?? 'AI Media Studio <noreply@yourdomain.com>'

export async function sendMediaEmail(opts: {
  to: string
  customerName: string
  mediaUrl: string
  mediaType: 'video' | 'image'
  refinedPrompt: string
  packageName: string
}) {
  const { to, customerName, mediaUrl, mediaType, refinedPrompt, packageName } = opts

  const firstName = customerName.split(' ')[0]
  const typeLabel = mediaType === 'video' ? 'Video' : 'Image'
  const actionLabel = mediaType === 'video' ? 'Watch your video' : 'View your image'
  const ext = mediaType === 'video' ? '.mp4' : '.jpg'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your AI ${typeLabel} is Ready</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e7eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-size:18px;font-weight:800;background:linear-gradient(90deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
            AI Media Studio
          </span>
        </td></tr>

        <!-- Main card -->
        <tr><td style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 36px;">

          <!-- Checkmark -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td align="center">
              <div style="width:56px;height:56px;border-radius:50%;background:rgba(124,58,237,0.15);display:inline-flex;align-items:center;justify-content:center;">
                <span style="font-size:24px;">✅</span>
              </div>
            </td></tr>
          </table>

          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;text-align:center;color:#f9fafb;">
            Your ${typeLabel} is Ready!
          </h1>
          <p style="margin:0 0 32px;text-align:center;color:#9ca3af;font-size:15px;">
            Hi ${firstName}, your <strong style="color:#e5e7eb;">${packageName} package</strong> order has been generated.
          </p>

          <!-- CTA button -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td align="center">
              <a href="${mediaUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:600;">
                ${actionLabel} →
              </a>
            </td></tr>
          </table>

          <!-- Download link -->
          <p style="text-align:center;margin:0 0 32px;">
            <a href="${mediaUrl}" download="ai-media${ext}" style="color:#8b5cf6;font-size:13px;text-decoration:underline;">
              Click to download${ext}
            </a>
          </p>

          <!-- Divider -->
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 28px;"/>

          <!-- Prompt used -->
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">
            Refined prompt used
          </p>
          <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;background:#0a0a0a;border-radius:8px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
            ${refinedPrompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#4b5563;">
            ⚠️ Download links expire in <strong>7 days</strong> — save your file now.
          </p>
          <p style="margin:0;font-size:11px;color:#374151;">
            Questions? Reply to this email. &nbsp;·&nbsp; © ${new Date().getFullYear()} AI Media Studio
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await getResend().emails.send({
    from: FROM(),
    to,
    subject: `Your AI ${typeLabel} is ready — AI Media Studio`,
    html,
  })
}
