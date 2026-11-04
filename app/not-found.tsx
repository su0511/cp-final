import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cosmic-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404</h1>
        <p className="text-cosmic-text-dim mb-8">This cosmic day was not found.</p>
        <Link 
          href="/" 
          className="text-cosmic-text hover:text-cosmic-text-dim transition-colors"
        >
          ← Return to Archive
        </Link>
      </div>
    </main>
  )
}

