// Backend API client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchElectionsFromAPI(status?: string) {
  const url = status ? `${API_URL}/elections?status=${status}` : `${API_URL}/elections`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch elections');
  const data = await res.json();
  return data.elections.map((e: any) => ({
    id: e.address,
    title: e.title,
    description: e.description,
    status: getStatus(e),
    startTime: new Date(e.startTime),
    endTime: new Date(e.endTime),
    totalVotes: e.totalVotes || 0,
    totalVoters: e.totalVoters || 0,
    candidates: e.candidates || [],
  }));
}

export async function fetchElectionFromAPI(address: string) {
  const res = await fetch(`${API_URL}/elections/${address}`);
  if (!res.ok) throw new Error('Failed to fetch election');
  const data = await res.json();
  const e = data.election;
  return {
    id: e.address,
    title: e.title,
    description: e.description,
    status: getStatus(e),
    startTime: new Date(e.startTime),
    endTime: new Date(e.endTime),
    totalVotes: e.totalVotes || 0,
    totalVoters: e.totalVoters || 0,
    candidates: e.candidates || [],
  };
}

export async function checkVoteStatus(address: string, voter: string) {
  const res = await fetch(`${API_URL}/votes/${address}/${voter}`);
  if (!res.ok) return { hasVoted: false };
  const data = await res.json();
  return data;
}

function getStatus(e: any): 'upcoming' | 'active' | 'ended' {
  const now = Date.now();
  const start = new Date(e.startTime).getTime();
  const end = new Date(e.endTime).getTime();
  if (e.isClosed || now > end) return 'ended';
  if (now < start) return 'upcoming';
  return 'active';
}

