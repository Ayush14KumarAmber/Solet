import { useEffect, useState } from 'react'
import Button from './ui/button'
import { hasMetaMask } from '../lib/eth'

function truncate(addr: string) { return addr.slice(0, 6) + '…' + addr.slice(-4) }

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const eth = (window as any).ethereum
    if (!eth) return
    // Try to read current account without prompting
    eth.request({ method: 'eth_accounts' }).then((accs: string[]) => {
      if (accs && accs.length > 0) setAddress(accs[0])
    }).catch(() => {})
    const onAccountsChanged = (accs: string[]) => setAddress(accs && accs.length > 0 ? accs[0] : null)
    const onChainChanged = () => {
      // Reload to ensure providers/signer update correctly
      // Some dapps soft-refresh; a hard reload is simplest for now
      window.location.reload()
    }
    eth.on?.('accountsChanged', onAccountsChanged)
    eth.on?.('chainChanged', onChainChanged)
    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged)
      eth.removeListener?.('chainChanged', onChainChanged)
    }
  }, [])

  async function connect() {
    if (!hasMetaMask()) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    try {
      setLoading(true)
      const eth = (window as any).ethereum
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
      }
    } catch (e: any) {
      // User rejected or other error
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function disconnect() {
    // MetaMask doesn’t support programmatic disconnect; clear local state
    setAddress(null)
  }

  return (
    <div className="flex items-center gap-2">
      {address ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{truncate(address)}</span>
          <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(address!)}>Copy</Button>
          <Button variant="ghost" size="sm" onClick={disconnect}>Disconnect</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={connect} disabled={loading}>{loading ? 'Connecting…' : 'Connect Wallet'}</Button>
          <span className="text-xs text-gray-500">MetaMask</span>
        </div>
      )}
    </div>
  )
}


