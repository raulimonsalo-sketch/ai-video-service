# Deploy to Vercel — 5 steps

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create ai-media-service --private --push --source=.
# or: git remote add origin https://github.com/YOU/ai-media-service.git && git push -u origin main
```

## 2. Import on Vercel

Go to https://vercel.com/new → Import your repo → Deploy with defaults.

After the first deploy, note your URL (e.g. `https://ai-media-service.vercel.app`).

## 3. Add Environment Variables

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Step 4 below |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/account/keys |
| `KLING_ACCESS_KEY` | https://klingai.com/dev → API Access |
| `KLING_SECRET_KEY` | https://klingai.com/dev → API Access |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `EMAIL_FROM` | `AI Media Studio <orders@yourdomain.com>` (must be a Resend verified domain) |
| `NEXT_PUBLIC_BASE_URL` | `https://your-project.vercel.app` (no trailing slash) |

Redeploy after adding variables.

## 4. Add Stripe Webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **Endpoint URL**: `https://your-project.vercel.app/api/webhook`
- **Events**: `checkout.session.completed`

Copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in Vercel → Redeploy.

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
