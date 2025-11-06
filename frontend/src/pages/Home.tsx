import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'
import ElectionCard from '../components/ElectionCard'
import { featuredElections } from '../data/mock'

export default function Home() {
  const [stats, setStats] = useState({ totalElections: '128', activeElections: '6', totalVoters: '4,215', participation: '62%' })

  useEffect(() => {
    (async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL
        if (apiUrl) {
          const res = await fetch(`${apiUrl}/admin/stats`)
          const data = await res.json()
          setStats({
            totalElections: String(data.totalElections || 0),
            activeElections: String(data.activeElections || 0),
            totalVoters: String(data.totalUsers || 0),
            participation: data.totalUsers > 0 ? `${Math.round((data.totalVotes / data.totalUsers) * 100)}%` : '0%',
          })
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    })()
  }, [])

  return (
    <div>
      <section className="brand-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Decentralized Governance Made Simple</h1>
          <p className="mt-3 text-white/90 max-w-2xl">Create, manage, and participate in elections with transparent on-chain results.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/elections" className="inline-flex h-11 px-6 items-center rounded-md bg-white text-gray-900 text-sm">Explore Elections</Link>
            <Link to="/admin" className="inline-flex h-11 px-6 items-center rounded-md bg-black/20 text-white border border-white/20 text-sm">Create Election</Link>
          </div>
          <div className="mt-10">
            <WalletConnect />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Elections', value: stats.totalElections },
            { label: 'Active Votes', value: stats.activeElections },
            { label: 'Total Voters', value: stats.totalVoters },
            { label: 'Participation', value: stats.participation },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white border p-4 text-center card-surface">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Elections</h2>
          <Link to="/elections" className="text-sm text-indigo-600">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredElections.map((e) => (
            <ElectionCard key={e.id} e={e} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Tamper-Proof Voting', desc: 'Votes are recorded on-chain with transparent results.' },
            { title: 'Real-Time Results', desc: 'Live tallies and progress indicators keep everyone informed.' },
            { title: 'Community Governance', desc: 'Empower your community to decide with confidence.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl bg-white border p-6 card-surface">
              <div className="text-lg font-semibold">{f.title}</div>
              <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


