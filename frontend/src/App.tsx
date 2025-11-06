import { Outlet } from 'react-router-dom'
import Navigation from './components/Navigation'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-sm text-gray-500 py-6">Solet • Testnet</footer>
    </div>
  )
}


