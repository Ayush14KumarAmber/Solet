import { useState } from 'react'
import WalletConnect from '../components/WalletConnect'
import Button from '../components/ui/button'
import Input from '../components/ui/input'
import { Tabs } from '../components/ui/tabs'

type Candidate = { id: string; name: string; description: string }

function genId() {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {}
  return Math.random().toString(36).slice(2)
}

export default function Admin() {
  const [tab, setTab] = useState('create')
  const [cands, setCands] = useState<Candidate[]>([{ id: genId(), name: '', description: '' }])

  function addCandidate() { setCands(v => [...v, { id: genId(), name: '', description: '' }]) }
  function removeCandidate(id: string) { setCands(v => v.length>1 ? v.filter(c=>c.id!==id) : v) }
  function updateCand(id: string, field: keyof Candidate, value: string) { setCands(v => v.map(c => c.id===id ? { ...c, [field]: value } : c)) }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <WalletConnect />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[{l:'Elections',v:'12'},{l:'Active',v:'3'},{l:'Voters',v:'2,314'},{l:'Participation',v:'58%'}].map(s=> (
          <div key={s.l} className="rounded-xl border bg-white p-4 card-surface text-center">
            <div className="text-2xl font-semibold">{s.v}</div>
            <div className="text-xs text-gray-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <Tabs tabs={[{id:'create',label:'Create Election'},{id:'manage',label:'Manage Elections'},{id:'settings',label:'Settings'}]} value={tab} onChange={setTab} />

      {tab==='create' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Title" />
            <Input placeholder="Description" />
            <Input placeholder="Start Date" type="datetime-local" />
            <Input placeholder="End Date" type="datetime-local" />
          </div>
          <div className="space-y-3">
            <div className="font-medium">Candidates</div>
            {cands.map(c => (
              <div key={c.id} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
                <Input placeholder="Name" value={c.name} onChange={e=>updateCand(c.id,'name',e.target.value)} />
                <Input placeholder="Description" value={c.description} onChange={e=>updateCand(c.id,'description',e.target.value)} />
                <Button variant="ghost" onClick={()=>removeCandidate(c.id)}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={addCandidate}>Add Candidate</Button>
          </div>
          <Button onClick={()=>alert('Election created! (simulated)')}>Create Election</Button>
        </div>
      )}

      {tab==='manage' && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Title</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[{t:'Treasury Allocation',s:'Active'},{t:'Protocol Upgrade v2.1',s:'Upcoming'},{t:'Marketing Split',s:'Ended'}].map((r,i)=> (
                <tr key={i} className="border-t">
                  <td className="py-2">{r.t}</td>
                  <td className="py-2">{r.s}</td>
                  <td className="py-2 space-x-2"><Button size="sm">View</Button><Button size="sm" variant="secondary">Edit</Button><Button size="sm" variant="ghost">Configure</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='settings' && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-4 card-surface">
            <div className="font-medium mb-2">Platform Settings</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Factory Address" />
              <Input placeholder="RPC URL" />
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 card-surface">
            <div className="font-medium mb-2">Admin Management</div>
            <div className="grid sm:grid-cols-[1fr_auto] gap-3">
              <Input placeholder="Admin Address" />
              <Button>Add Admin</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


