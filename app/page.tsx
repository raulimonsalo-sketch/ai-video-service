'use client'

import { useState } from 'react'

const PACKAGES = {
  starter: {
    name: 'Starter',
    price: 29,
    tagline: '1 AI Image',
    features: [
      '1 high-quality AI image',
      '1024 × 1024 resolution',
      'AI prompt refinement',
      'Email delivery within 15 min',
    ],
    badge: null,
    mediaTypes: ['image'] as const,
  },
  creator: {
    name: 'Creator',
    price: 79,
    tagline: '1 AI Video · 5 seconds',
    features: [
      '1 AI-generated video (5 sec)',
      '1080p HD quality',
      'Standard generation mode',
      'AI prompt refinement',
      'Email delivery within 30 min',
    ],
    badge: 'Most Popular',
    mediaTypes: ['video'] as const,
  },
  studio: {
    name: 'Studio',
    price: 199,
    tagline: '1 AI Video · 10 seconds · Pro',
    features: [
      '1 AI-generated video (10 sec)',
      '4K ultra quality',
      'Pro cinematic mode',
      'AI prompt refinement',
      'Priority processing',
      'Email delivery within 30 min',
    ],
    badge: 'Best Quality',
    mediaTypes: ['video'] as const,
  },
} as const

type PackageKey = keyof typeof PACKAGES

type FormState = {
  name: string
  email: string
  description: string
  style: string
}

const INITIAL_FORM: FormState = { name: '', email: '', description: '', style: '' }
const DESC_MAX = 500
const STYLE_MAX = 200

export default function Home() {
  const [selectedPkg, setSelectedPkg] = useState<PackageKey | null>(null)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openModal = (pkg: PackageKey) => {
    setSelectedPkg(pkg)
    setForm(INITIAL_FORM)
    setError(null)
  }

  const closeModal = () => {
    if (!submitting) setSelectedPkg(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPkg) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, package: selectedPkg }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error. Please try again.')
      setSubmitting(false)
    }
  }

  const pkg = selectedPkg ? PACKAGES[selectedPkg] : null

  return (
    <main className="min-h-screen bg-black">
      {/* ── Nav ── */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight gradient-text">AI Media Studio</span>
          <a
            href="#pricing"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            See Packages
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 uppercase tracking-widest font-medium">
            Powered by Kling AI + Claude
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Turn words into{' '}
            <span className="gradient-text">stunning visuals</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your vision. We refine your prompt with AI and generate professional-grade
            videos and photos — delivered straight to your inbox.
          </p>

          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 px-8 py-4 text-base font-semibold transition-colors"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe your vision',
                body: 'Tell us what you want — a cinematic landscape, a product showcase, or a creative concept. Any idea works.',
              },
              {
                step: '02',
                title: 'AI refines & generates',
                body: 'Claude upgrades your description into an optimised cinematic prompt, then Kling AI renders your media.',
              },
              {
                step: '03',
                title: 'Delivered to your inbox',
                body: 'Your video or image lands in your email as soon as it\'s ready — usually within 30 minutes.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative pl-14">
                <span className="absolute left-0 top-0 text-4xl font-black text-white/5 select-none leading-none">
                  {step}
                </span>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Choose your package</h2>
          <p className="text-center text-white/50 text-sm mb-14">
            One-time payment. No subscription. No hidden fees.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {(Object.entries(PACKAGES) as [PackageKey, typeof PACKAGES[PackageKey]][]).map(
              ([key, p]) => (
                <div
                  key={key}
                  className={`relative flex flex-col rounded-2xl p-6 border transition-all duration-200 ${
                    key === 'creator'
                      ? 'bg-violet-950/40 border-violet-500/40 card-glow-active'
                      : 'bg-white/3 border-white/8 card-glow hover:border-white/20'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold whitespace-nowrap">
                      {p.badge}
                    </span>
                  )}

                  <div className="mb-5">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-extrabold">${p.price}</span>
                      <span className="text-white/40 text-sm">one-time</span>
                    </div>
                    <p className="text-sm text-violet-300">{p.tagline}</p>
                  </div>

                  <ul className="flex-1 space-y-2.5 mb-7">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0 text-violet-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openModal(key)}
                    className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                      key === 'creator'
                        ? 'bg-violet-600 hover:bg-violet-500 active:bg-violet-700'
                        : 'bg-white/10 hover:bg-white/15 active:bg-white/8'
                    }`}
                  >
                    Order Now — ${p.price}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'How long does generation take?',
                a: 'Images are usually ready in 10–15 minutes. Videos take 20–30 minutes depending on length and queue.',
              },
              {
                q: 'What happens after I pay?',
                a: 'You\'ll get an order confirmation immediately. Once your media is generated, it\'s sent directly to your email with a download link.',
              },
              {
                q: 'Can I use the content commercially?',
                a: 'Yes. You receive full commercial rights to use the generated media in any project, campaign, or product.',
              },
              {
                q: 'What if I\'m not happy with the result?',
                a: 'Contact us with your original order and we\'ll regenerate it at no cost. We want you to love your media.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-white/8 pb-6">
                <h3 className="font-semibold mb-2">{q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/30">
        <p>© {new Date().getFullYear()} AI Media Studio. All rights reserved.</p>
        <p className="mt-1">Secure payments via Stripe. Media generated by Kling AI.</p>
      </footer>

      {/* ── Order Modal ── */}
      {selectedPkg && pkg && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative w-full max-w-lg bg-[#0e0e0e] rounded-2xl border border-white/10 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-[#0e0e0e] flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  {pkg.name} Package
                </p>
                <p className="font-bold text-lg">${pkg.price} · {pkg.tagline}</p>
              </div>
              <button
                onClick={closeModal}
                disabled={submitting}
                className="text-white/40 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
                    Your name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                    Describe what you want
                  </label>
                  <span className={`text-xs ${form.description.length > DESC_MAX * 0.9 ? 'text-amber-400' : 'text-white/30'}`}>
                    {form.description.length}/{DESC_MAX}
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  maxLength={DESC_MAX}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={
                    selectedPkg !== 'starter'
                      ? 'e.g. A drone shot flying over a misty mountain valley at golden hour, pine trees below, dramatic clouds...'
                      : 'e.g. A professional product photo of a sleek black coffee mug on a marble surface, soft window light, minimal style...'
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors resize-none leading-relaxed"
                />
                <p className="mt-1.5 text-xs text-white/30">
                  Be as specific as possible — mood, colors, subject, setting, camera angle.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                    Style notes{' '}
                    <span className="normal-case text-white/25 font-normal">(optional)</span>
                  </label>
                  <span className={`text-xs ${form.style.length > STYLE_MAX * 0.9 ? 'text-amber-400' : 'text-white/30'}`}>
                    {form.style.length}/{STYLE_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={STYLE_MAX}
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                  placeholder="e.g. Cinematic, 35mm film, vibrant colors, minimalist, photorealistic..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting to payment…
                  </>
                ) : (
                  <>
                    Continue to Payment — ${pkg.price}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/25">
                Secure checkout via Stripe · SSL encrypted
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
