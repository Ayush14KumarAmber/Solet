import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="text-2xl font-semibold mt-4">Page not found</h1>
      <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="inline-flex mt-6 h-10 px-4 items-center rounded-md bg-indigo-600 text-white text-sm">Go Home</Link>
    </div>
  )
}


