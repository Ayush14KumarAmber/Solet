import { Election } from '../components/ElectionCard'

const now = Date.now()
const h = (n: number) => new Date(now + n * 3600_000)

export const featuredElections: Election[] = [
  {
    id: '1', title: 'Community Treasury Allocation', description: 'Allocate quarterly funds to ecosystem initiatives.',
    status: 'active', startTime: h(-1), endTime: h(3), totalVotes: 234, totalVoters: 500,
    candidates: [
      { id: 'a', name: 'Infra Grants', votes: 120 },
      { id: 'b', name: 'Community Events', votes: 78 },
      { id: 'c', name: 'R&D', votes: 36 },
    ],
  },
  {
    id: '2', title: 'Protocol Upgrade v2.1', description: 'Adopt proposed performance improvements and fee tweaks.',
    status: 'upcoming', startTime: h(5), endTime: h(10), totalVotes: 0, totalVoters: 0,
    candidates: [
      { id: 'a', name: 'Yes', votes: 0 },
      { id: 'b', name: 'No', votes: 0 },
    ],
  },
  {
    id: '3', title: 'Marketing Budget Split', description: 'Distribute budget across channels for next quarter.',
    status: 'ended', startTime: h(-10), endTime: h(-2), totalVotes: 1021, totalVoters: 1500,
    candidates: [
      { id: 'a', name: 'Content', votes: 420 },
      { id: 'b', name: 'Ads', votes: 360 },
      { id: 'c', name: 'Events', votes: 241 },
    ],
  },
]

export const allElections: Election[] = [
  ...featuredElections,
  {
    id: '4', title: 'Delegate Rewards Framework', description: 'Define KPI targets and compensation bands.',
    status: 'active', startTime: h(-3), endTime: h(8), totalVotes: 312, totalVoters: 800,
    candidates: [
      { id: 'a', name: 'Framework A', votes: 180 },
      { id: 'b', name: 'Framework B', votes: 132 },
    ],
  },
  { id: '5', title: 'DAO Charter Update', description: 'Adopt new governance rules.', status: 'upcoming', startTime: h(12), endTime: h(24), totalVotes: 0, totalVoters: 0, candidates: [{ id:'a', name:'Approve', votes:0},{ id:'b', name:'Reject', votes:0}] },
  { id: '6', title: 'Validator Onboarding', description: 'Add new validators to the network.', status: 'active', startTime: h(-2), endTime: h(6), totalVotes: 88, totalVoters: 140, candidates: [{id:'a',name:'List A',votes:40},{id:'b',name:'List B',votes:48}] },
  { id: '7', title: 'Bug Bounty Tiering', description: 'Adjust severity payouts.', status: 'ended', startTime: h(-30), endTime: h(-20), totalVotes: 412, totalVoters: 900, candidates: [{id:'a',name:'Tier Set 1',votes:210},{id:'b',name:'Tier Set 2',votes:202}] },
  { id: '8', title: 'Grant Round #7', description: 'Select finalists for funding.', status: 'upcoming', startTime: h(30), endTime: h(40), totalVotes: 0, totalVoters: 0, candidates: [{id:'a',name:'Top 10',votes:0},{id:'b',name:'Top 20',votes:0}] },
  { id: '9', title: 'NFT Collection Theme', description: 'Choose seasonal theme.', status: 'active', startTime: h(-1), endTime: h(15), totalVotes: 33, totalVoters: 80, candidates: [{id:'a',name:'Retro',votes:20},{id:'b',name:'Futuristic',votes:13}] },
]


