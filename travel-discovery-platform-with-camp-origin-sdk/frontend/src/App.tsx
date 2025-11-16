import React, { useState } from 'react'
import { fetchRecommendations, Attraction } from './api'
import SearchBar from './components/SearchBar'
import Recommendations from './components/Recommendations'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Attraction[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(query: string) {
    console.log('Searching for:', query)
    setError(null)
    console.log('Fetching recommendations...')
    setLoading(true)
    console.log('Loading state set to true')
    try {
      // const res = await fetchRecommendations({ query })
      const res = await fetchRecommendations(query)
      setResults(res)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header mb-4">
        <h1 className="font-bold">AI Trip Finder</h1>
        <p className="text-sm text-slate-600">Get personalized travel suggestions powered by the LLM backend</p>
      </header>

      <main>
        <SearchBar onSearch={handleSearch} loading={loading} />
        {error && <div className="text-red-600 mt-3">Error: {error}</div>}
        <Recommendations items={results} />
      </main>

      <footer className="mt-6 text-sm text-slate-500">
        Built from travel-discovery-platform-with-camp-origin-sdk
      </footer>
    </div>
  )
}