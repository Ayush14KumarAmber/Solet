import { Link, NavLink } from 'react-router-dom'
import Badge from './ui/badge'

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-semibold text-lg">Solet</Link>
          <nav className="hidden sm:flex items-center space-x-4 text-sm">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}>Home</NavLink>
            <NavLink to="/elections" className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}>Elections</NavLink>
            <NavLink to="/admin" className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}>Admin</NavLink>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="muted">Testnet</Badge>
          <button className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200">≡</button>
        </div>
      </div>
    </header>
  )
}


