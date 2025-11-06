import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from './ui/card'
import Badge from './ui/badge'
import Progress from './ui/progress'

export interface Election {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'active' | 'ended';
  startTime: Date;
  endTime: Date;
  totalVotes: number;
  totalVoters: number;
  candidates: Array<{ id: string; name: string; votes: number }>;
}

function statusBadge(status: Election['status']) {
  if (status === 'active') return <Badge variant="success">Active</Badge>
  if (status === 'upcoming') return <Badge variant="warning">Upcoming</Badge>
  return <Badge variant="muted">Ended</Badge>
}

function timelinePct(e: Election) {
  const total = e.endTime.getTime() - e.startTime.getTime()
  const now = Date.now()
  const elapsed = Math.min(Math.max(0, now - e.startTime.getTime()), total)
  return Math.round((elapsed / total) * 100) || 0
}

export default function ElectionCard({ e }: { e: Election }) {
  const pct = timelinePct(e)
  const totalVotes = e.candidates.reduce((a, c) => a + c.votes, 0)
  const leader = e.candidates.slice().sort((a, b) => b.votes - a.votes)[0]
  const leaderPct = totalVotes ? Math.round((leader.votes / totalVotes) * 100) : 0

  return (
    <Card className="hover:shadow-card transition-transform hover:scale-[1.01]">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{e.title}</h3>
          {statusBadge(e.status)}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{e.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={pct} />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{pct}%</span>
            <span>{e.status === 'active' ? 'Time remaining' : e.status === 'upcoming' ? 'Starts soon' : 'Ended'}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div><div className="text-gray-500">Votes</div><div className="font-medium">{totalVotes}</div></div>
            <div><div className="text-gray-500">Candidates</div><div className="font-medium">{e.candidates.length}</div></div>
            <div><div className="text-gray-500">Voters</div><div className="font-medium">{e.totalVoters}</div></div>
          </div>
          {totalVotes > 0 && (
            <div className="text-xs text-gray-600">Leading: <span className="font-medium">{leader.name}</span> · {leaderPct}% ({leader.votes})</div>
          )}
          <div className="pt-2">
            <Link to={`/election/${e.id}`} className="inline-flex h-10 px-4 items-center rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-500">
              {e.status === 'active' ? 'Vote Now' : 'View Details'}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


