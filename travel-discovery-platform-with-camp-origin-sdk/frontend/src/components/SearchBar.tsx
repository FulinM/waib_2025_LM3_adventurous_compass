import React, { useState } from 'react'

type Props = {
  onSearch: (q: string) => void
  loading?: boolean
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [q, setQ] = useState('')

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!q.trim()) return
    onSearch(q.trim())
  }

  return (
    <form className="flex gap-2 mb-4" onSubmit={submit}>
      <input
        className="flex-1 p-3 rounded border border-slate-200"
        placeholder="e.g. relaxed beach week in Greece, family-friendly Tokyo..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search trips"
      />
      <button
        className="bg-blue-600 text-white px-4 rounded disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Find Trips'}
      </button>
    </form>
  )
}