import { getContract, getProvider, getSigner, getFactoryAddress } from './eth'
import { VotingFactoryABI, ElectionABI } from './abi'

export async function fetchFactoryElections(limit = 12) {
  const factoryAddr = getFactoryAddress()
  if (!factoryAddr) throw new Error('VITE_FACTORY_ADDRESS not set')
  const provider = await getProvider()
  const factory = getContract(factoryAddr, VotingFactoryABI, provider)
  const count: bigint = await factory.getElectionsCount()
  const n = Number(count)
  const size = Math.min(n, limit)
  const start = Math.max(0, n - size)
  const items: string[] = []
  for (let i = start; i < n; i++) {
    items.push(await factory.elections(i))
  }
  return items.reverse()
}

export async function fetchElectionDetails(address: string) {
  const provider = await getProvider()
  const election = getContract(address, ElectionABI, provider)
  const [meta, isClosed, candidatesCount] = await Promise.all([
    election.meta(),
    election.isClosed(),
    election.candidatesCount(),
  ])
  const cNum = Number(candidatesCount)
  const candidates = [] as Array<{ id: string; name: string; votes: number }>
  for (let i = 0; i < cNum; i++) {
    const c = await election.getCandidate(i)
    candidates.push({ id: String(c.id), name: c.name, votes: Number(c.voteCount) })
  }
  return {
    title: meta.title as string,
    description: meta.description as string,
    startTime: new Date(Number(meta.startTime) * 1000),
    endTime: new Date(Number(meta.endTime) * 1000),
    isClosed: Boolean(isClosed),
    candidates,
  }
}

export async function submitVote(address: string, candidateId: number) {
  const signer = await getSigner()
  const election = getContract(address, ElectionABI, signer)
  const tx = await election.vote(candidateId)
  return await tx.wait()
}


