import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'
import { allElections } from '../data/mock'
import Progress from '../components/ui/progress'
import Button from '../components/ui/button'
import Badge from '../components/ui/badge'
import { fetchElectionFromAPI } from '../lib/api'
import { fetchElectionDetails, submitVote } from '../lib/contracts'

export default function ElectionDetails() {
  const { id } = useParams()
  const [e, setE] = useState(() => allElections.find(x => x.id === id) || allElections[0])
  const [address] = useState<string | null>(id || null)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(!!address)
  const isEnded = e.status === 'ended'

  const totalVotes = e.candidates.reduce((a, c) => a + c.votes, 0)
  const pct = (() => {
    const total = e.endTime.getTime() - e.startTime.getTime()
    const now = Date.now()
    const elapsed = Math.min(Math.max(0, now - e.startTime.getTime()), total)
    return Math.round((elapsed / total) * 100) || 0
  })()

  async function submitVoteAction() {
    if (!selected) return
    setSubmitting(true)
    try {
      if (address) await submitVote(address, Number(e.candidates.find(c=>c.id===selected)?.id ?? 0))
      else await new Promise(r => setTimeout(r, 2000))
      alert('Vote submitted!')
    } catch (err: any) {
      alert(err?.message || 'Failed to submit vote')
    }
    setSubmitting(false)
  }

  useEffect(() => {
    (async () => {
      if (!address) return
      setLoading(true)
      try {
        // Try backend API first
        const apiUrl = import.meta.env.VITE_API_URL
        let d
        if (apiUrl) {
          d = await fetchElectionFromAPI(address)
        } else {
          d = await fetchElectionDetails(address)
          const now = Date.now()
          const status = now < d.startTime.getTime() ? 'upcoming' : (now > d.endTime.getTime() || d.isClosed) ? 'ended' : 'active'
          d.status = status
        }
        setE({
          id: address,
          title: d.title,
          description: d.description,
          status: d.status as 'upcoming'|'active'|'ended',
          startTime: d.startTime,
          endTime: d.endTime,
          totalVotes: d.totalVotes,
          totalVoters: d.totalVoters,
          candidates: d.candidates,
        })
      } catch (err) {
        console.error('Failed to fetch election:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [address])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/elections" className="text-sm text-gray-600">← Back to Elections</Link>

      <div className="mt-4 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <section className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-semibold">{e.title}</h1>
            {e.status === 'active' && <Badge variant="success">Active</Badge>}
            {e.status === 'upcoming' && <Badge variant="warning">Upcoming</Badge>}
            {e.status === 'ended' && <Badge variant="muted">Ended</Badge>}
          </div>
          <p className="text-gray-600">{e.description}</p>
          <Progress value={pct} />
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><div className="text-gray-500">Total Votes</div><div className="font-medium">{totalVotes}</div></div>
            <div><div className="text-gray-500">Candidates</div><div className="font-medium">{e.candidates.length}</div></div>
            <div><div className="text-gray-500">Voters</div><div className="font-medium">{e.totalVoters}</div></div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {e.candidates.map(c => {
              const cpct = totalVotes ? Math.round((c.votes / totalVotes) * 100) : 0
              return (
                <label key={c.id} className={`rounded-xl border p-4 bg-white card-surface ${selected===c.id?'ring-2 ring-indigo-500':''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-gray-600">Votes: {c.votes} · {cpct}%</div>
                    </div>
                    <input type="radio" name="candidate" checked={selected===c.id} onChange={()=>setSelected(c.id)} />
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-indigo-500 rounded" style={{width:`${cpct}%`}}/>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Proposal Details</h3>
            <p className="text-sm text-gray-700">This proposal outlines the scope of the election and expected outcomes. In a real dApp, this section would be hydrated from on-chain metadata or IPFS.</p>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-white p-4 card-surface">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Your Wallet</div>
            </div>
            <WalletConnect />
          </div>
          <div className="rounded-xl border bg-white p-4 card-surface space-y-3">
            <div className="text-sm text-gray-600">Selected</div>
            <div className="font-medium">{e.candidates.find(c=>c.id===selected)?.name || 'None'}</div>
            <Button disabled={!selected || isEnded || submitting} onClick={submitVoteAction}>{submitting?'Submitting…':'Submit Vote'}</Button>
            {isEnded && <div className="text-xs text-gray-500">Voting is closed for this election.</div>}
            <div className="text-xs text-gray-500">
              Voting rules: One vote per wallet. Eligibility may be open, allowlist, or token-gated.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}


