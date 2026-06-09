export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-violet-500/15 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3">You&rsquo;re all set!</h1>
        <p className="text-white/60 text-base leading-relaxed mb-8">
          Your order has been confirmed and generation has started. You&rsquo;ll receive your media
          at the email address you provided — usually within 30 minutes.
        </p>

        <div className="rounded-2xl bg-white/3 border border-white/8 p-6 text-left space-y-4 mb-8">
          {[
            ['Prompt refinement', 'Claude is optimising your description for best results'],
            ['Media generation', 'Kling AI is rendering your video or image'],
            ['Email delivery', 'We\'ll email your download link as soon as it\'s ready'],
          ].map(([title, desc], i) => (
            <div key={title} className="flex items-start gap-4">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/30 mb-6">
          Check your spam folder if you don&rsquo;t see the email. Download links expire after 7 days.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>
      </div>
    </main>
  )
}
