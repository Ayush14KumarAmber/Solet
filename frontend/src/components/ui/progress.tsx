export default function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div className="h-2 rounded bg-indigo-500" style={{ width: `${v}%` }} />
    </div>
  )
}


