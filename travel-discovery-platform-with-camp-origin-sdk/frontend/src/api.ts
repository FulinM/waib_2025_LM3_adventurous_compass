export type RecommendRequest = {
  query: string
}

export type Attraction = {
  id?: string
  Name?: string
  Url?: string
  Telephone?: string
  Address?: string
  Tags?: string
  score?: number
  image_url?: string
  [k: string]: any
}

// export async function fetchRecommendations(payload: RecommendRequest): Promise<Attraction[]> {
export async function fetchRecommendations(payload: string): Promise<Attraction[]> {
  // const res = await fetch(`/api/recommend`, {
  const url = `/search/${encodeURIComponent(payload)}`
  console.log('API request url:', url)
  const res = await fetch(url, {
    // method: 'POST',
    method: 'GET',
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error: ${res.status} ${text}`)
  }
  return res.json()
}