import { HTMLAttributes } from 'react'
import clsx from 'classnames'

type Props = HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'muted' }

export default function Badge({ className, variant = 'default', ...props }: Props) {
  const variants: Record<string, string> = {
    default: 'bg-indigo-100 text-indigo-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    muted: 'bg-gray-100 text-gray-700',
  }
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)} {...props} />
}


