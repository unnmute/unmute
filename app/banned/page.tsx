export default function BannedPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <div className="text-4xl mb-6">🚫</div>
      <h1 className="text-xl font-light mb-3">
        You&apos;ve been removed from Unmute
      </h1>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Your account was automatically flagged after multiple community reports.
        This decision exists to protect the people in this space.
      </p>
      <p className="text-xs text-muted-foreground/50 mt-8">
        If you believe this is a mistake, contact unnmute@gmail.com
      </p>
    </main>
  )
}
