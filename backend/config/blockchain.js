import { JsonRpcProvider, Contract } from 'ethers';

export function getProvider() {
  const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
  return new JsonRpcProvider(rpcUrl);
}

export function getFactoryContract(provider) {
  const factoryAddress = process.env.FACTORY_ADDRESS;
  if (!factoryAddress) throw new Error('FACTORY_ADDRESS not set');
  
  const factoryABI = [
    'function getElectionsCount() view returns (uint256)',
    'function elections(uint256) view returns (address)',
    'event ElectionCreated(address indexed electionAddress, uint256 indexed electionId, address indexed creator)',
  ];
  return new Contract(factoryAddress, factoryABI, provider);
}

export function getElectionContract(address, provider) {
  const electionABI = [
    'function meta() view returns (string title, string description, uint64 startTime, uint64 endTime)',
    'function votingMode() view returns (uint8)',
    'function isClosed() view returns (bool)',
    'function candidatesCount() view returns (uint256)',
    'function getCandidate(uint256) view returns (tuple(uint256 id, string name, string metadataUrl, uint256 voteCount))',
    'event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 timestamp)',
    'event ElectionClosed()',
  ];
  return new Contract(address, electionABI, provider);
}

