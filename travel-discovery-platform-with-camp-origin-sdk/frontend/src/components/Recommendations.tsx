import React from 'react'
import DestinationCard from './DestinationCard'
import { Attraction } from '../api'

export default function Recommendations({ items }: { items: Attraction[] }) {
  if (!items || items.length === 0) {
    return <div className="text-slate-500 py-6">No recommendations yet — try a search above.</div>
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <DestinationCard key={it.id} item={it} />
      ))}
    </section>
  )
}