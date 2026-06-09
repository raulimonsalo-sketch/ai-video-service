# Deploy to Railway — 5 steps

## 1. Push to GitHub

```bash
git add .
git commit -m "Switch deployment to Railway"
git push
```

## 2. Create a Railway project

1. Go to https://railway.app/new
2. Click **Deploy from GitHub repo** → select `ai-video-service`
3. Railway auto-detects Next.js and runs `npm run build` then `npm run start`
4. After the first deploy, go to **Settings → Networking → Generate Domain** to get your public URL (e.g. `https://ai-video-service.up.railway.app`)

## 3. Add Environment Variables

In Railway → your service → **Variables**, add:

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Step 4 below |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/account/keys |
| `KLING_ACCESS_KEY` | https://klingai.com/dev → API Access |
| `KLING_SECRET_KEY` | https://klingai.com/dev → API Access |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `EMAIL_FROM` | `AI Media Studio <orders@yourdomain.com>` (must be a Resend verified domain) |
| `NEXT_PUBLIC_BASE_URL` | `https://your-project.up.railway.app` (no trailing slash) |

Railway redeploys automatically after saving variables.

## 4. Add Stripe Webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **Endpoint URL**: `https://your-project.up.railway.app/api/webhook`
- **Events**: `checkout.session.completed`

Copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in Railway → redeploy.

## 5. Verify Resend sender domain

In Resend → Domains → Add your domain and verify DNS records.
Set `EMAIL_FROM` to match that domain.

---

## Local development

```bash
cp .env.local.example .env.local
# Fill in your keys
npm run dev
```

For local Stripe webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhook
# Copy the webhook signing secret printed by stripe listen into .env.local
```

## Money flow

```
Customer fills form
  → POST /api/checkout  → Stripe Checkout Session created
  → Customer pays on Stripe
  → Stripe fires webhook → POST /api/webhook
      → Claude refines prompt
      → Kling AI starts generation (async, callback URL set)
  → Kling AI calls POST /api/kling-callback when done
      → Resend sends email with download link to customer
```
