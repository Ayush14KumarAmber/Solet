import { useEffect, useMemo, useState } from 'react'
import Input from '../components/ui/input'
import { Tabs } from '../components/ui/tabs'
import ElectionCard from '../components/ElectionCard'
import { allElections } from '../data/mock'
import { fetchElectionsFromAPI } from '../lib/api'
import { fetchFactoryElections, fetchElectionDetails } from '../lib/contracts'

export default function Elections() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')
  const [live, setLive] = useState<typeof allElections | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        // Try backend API first
        const apiUrl = import.meta.env.VITE_API_URL
        if (apiUrl) {
          const status = tab === 'all' ? undefined : tab
          const elections = await fetchElectionsFromAPI(status)
          setLive(elections)
        } else {
          // Fallback to direct blockchain
          const addrs = await fetchFactoryElections(12)
          const details = await Promise.all(addrs.map(async (addr) => {
            const d = await fetchElectionDetails(addr)
            const now = Date.now()
            const status = now < d.startTime.getTime() ? 'upcoming' : (now > d.endTime.getTime() || d.isClosed) ? 'ended' : 'active'
            const totalVotes = d.candidates.reduce((a,c)=>a+c.votes,0)
            return {
              id: addr,
              title: d.title,
              description: d.description,
              status: status as 'upcoming'|'active'|'ended',
              startTime: d.startTime,
              endTime: d.endTime,
              totalVotes,
              totalVoters: totalVotes,
              candidates: d.candidates,
            }
          }))
          setLive(details)
        }
      } catch (err) {
        console.error('Failed to fetch elections:', err)
        setLive(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [tab])

  const dataset = live ?? allElections
  const results = useMemo(() => {
    const filter = dataset.filter(e => (tab === 'all' || e.status === tab) && (e.title.toLowerCase().includes(q.toLowerCase()) || e.description.toLowerCase().includes(q.toLowerCase())))
    return filter
  }, [q, tab, dataset])

  const tabs = [
    { id: 'all', label: `All (${dataset.length})` },
    { id: 'active', label: `Active (${dataset.filter(e=>e.status==='active').length})` },
    { id: 'upcoming', label: `Upcoming (${dataset.filter(e=>e.status==='upcoming').length})` },
    { id: 'ended', label: `Ended (${dataset.filter(e=>e.status==='ended').length})` },
  ]

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">Loading elections...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Input placeholder="Search elections..." value={q} onChange={e=>setQ(e.target.value)} />
          <div className="absolute right-3 top-2.5 text-gray-400 text-sm">⌘K</div>
        </div>
        <button className="h-10 px-3 rounded-md border border-gray-300 text-sm bg-white">Filter</button>
      </div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {results.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No elections found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(e => <ElectionCard key={e.id} e={e} />)}
        </div>
      )}
    </div>
  )
}


