import { BrowserProvider, Contract, Eip1193Provider, JsonRpcProvider } from 'ethers'

export function getRpcUrl() {
  return import.meta.env.VITE_RPC_URL as string | undefined
}

export function getFactoryAddress() {
  return import.meta.env.VITE_FACTORY_ADDRESS as string | undefined
}

export function hasMetaMask(): boolean {
  return typeof window !== 'undefined' && !!(window as any).ethereum
}

export async function getProvider() {
  const rpc = getRpcUrl()
  if (hasMetaMask()) {
    return new BrowserProvider((window as any).ethereum as Eip1193Provider)
  }
  if (rpc) return new JsonRpcProvider(rpc)
  throw new Error('No provider available: install MetaMask or set VITE_RPC_URL')
}

export async function getSigner() {
  const provider = await getProvider()
  if (provider instanceof BrowserProvider) {
    return provider.getSigner()
  }
  throw new Error('No signer available: use a browser wallet')
}

export function getContract(address: string, abi: any, providerOrSigner: any) {
  return new Contract(address, abi, providerOrSigner)
}


