// Minimal ABIs needed by the UI (keep small for quick loads)

export const VotingFactoryABI = [
  { "inputs": [{"internalType":"address","name":"initialAdmin","type":"address"}], "stateMutability":"nonpayable", "type":"constructor" },
  { "inputs": [], "name": "ADMIN_ROLE", "outputs": [{"internalType":"bytes32","name":"","type":"bytes32"}], "stateMutability":"view", "type":"function" },
  { "inputs": [], "name": "getElectionsCount", "outputs": [{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view", "type":"function" },
  { "inputs": [{"internalType":"uint256","name":"","type":"uint256"}], "name": "elections", "outputs": [{"internalType":"address","name":"","type":"address"}], "stateMutability":"view", "type":"function" },
  { "anonymous":false, "inputs":[{"indexed":true,"internalType":"address","name":"electionAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"electionId","type":"uint256"},{"indexed":true,"internalType":"address","name":"creator","type":"address"}], "name":"ElectionCreated", "type":"event" },
  { "inputs": [
      { "components":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint64","name":"startTime","type":"uint64"},{"internalType":"uint64","name":"endTime","type":"uint64"}], "internalType":"struct ElectionLib.ElectionMeta", "name":"meta", "type":"tuple" },
      { "internalType":"uint8", "name":"mode", "type":"uint8" },
      { "internalType":"address", "name":"token", "type":"address" },
      { "internalType":"uint256", "name":"minBalance", "type":"uint256" },
      { "internalType":"address[]", "name":"allowlist", "type":"address[]" }
    ], "name":"createElection", "outputs": [{"internalType":"address","name":"electionAddress","type":"address"}], "stateMutability":"nonpayable", "type":"function" }
]

export const ElectionABI = [
  { "inputs": [
      {"internalType":"address","name":"_admin","type":"address"},
      {"components":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint64","name":"startTime","type":"uint64"},{"internalType":"uint64","name":"endTime","type":"uint64"}],"internalType":"struct ElectionLib.ElectionMeta","name":"_meta","type":"tuple"},
      {"internalType":"uint8","name":"_mode","type":"uint8"},
      {"internalType":"address","name":"_token","type":"address"},
      {"internalType":"uint256","name":"_minBalance","type":"uint256"},
      {"internalType":"address","name":"_factory","type":"address"}
    ], "stateMutability":"nonpayable", "type":"constructor" },
  { "inputs": [], "name": "meta", "outputs": [
      {"internalType":"string","name":"title","type":"string"},
      {"internalType":"string","name":"description","type":"string"},
      {"internalType":"uint64","name":"startTime","type":"uint64"},
      {"internalType":"uint64","name":"endTime","type":"uint64"}
    ], "stateMutability":"view", "type":"function" },
  { "inputs": [], "name": "votingMode", "outputs": [{"internalType":"uint8","name":"","type":"uint8"}], "stateMutability":"view", "type":"function" },
  { "inputs": [], "name": "isClosed", "outputs": [{"internalType":"bool","name":"","type":"bool"}], "stateMutability":"view", "type":"function" },
  { "inputs": [], "name": "candidatesCount", "outputs": [{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view", "type":"function" },
  { "inputs": [{"internalType":"uint256","name":"index","type":"uint256"}], "name": "getCandidate", "outputs": [
      {"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"metadataUrl","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"internalType":"struct ElectionLib.Candidate","name":"","type":"tuple"}
    ], "stateMutability":"view", "type":"function" },
  { "inputs": [{"internalType":"uint256","name":"candidateId","type":"uint256"}], "name": "vote", "outputs": [], "stateMutability":"nonpayable", "type":"function" },
]


