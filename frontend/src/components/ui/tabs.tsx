import { ReactNode, useState } from 'react'
import clsx from 'classnames'

export type Tab = { id: string; label: ReactNode }

export function Tabs({ tabs, value, onChange }: { tabs: Tab[]; value?: string; onChange?: (id: string) => void }) {
  const [local, setLocal] = useState(value ?? tabs[0]?.id)
  const active = value ?? local
  const set = (id: string) => { setLocal(id); onChange?.(id) }
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(t => (
          <button key={t.id} className={clsx('whitespace-nowrap py-3 border-b-2 text-sm font-medium', active === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}
            onClick={() => set(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}


