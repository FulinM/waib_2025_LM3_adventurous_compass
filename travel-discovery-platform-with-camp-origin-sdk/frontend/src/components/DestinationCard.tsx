import React, { useEffect, useState } from 'react'
import { Attraction } from '../api'

export default function DestinationCard({ item }: { item: Attraction }) {
  console.log('Rendering DestinationCard for item:', item)

  const [imageUrl, setImageUrl] = useState<string | undefined>(item.image_url)
  const [loadingImage, setLoadingImage] = useState(false)

  useEffect(() => {
    let aborted = false
    const controller = new AbortController()
    async function fetchImage() {
      if (item.image_url) {
        setImageUrl(item.image_url)
        return
      }
      if (!item.Name) return

      setLoadingImage(true)
      try {
        const res = await fetch(`/api/image-search?query=${encodeURIComponent(item.Name)}`, {
          method: 'GET',
          signal: controller.signal
        })
        if (!res.ok) {
          console.warn('Image search failed', res.status)
          return
        }
        const data = await res.json()
        // Expecting { image_url: string | null }
        if (aborted) return
        if (data && data.image_url) {
          setImageUrl(data.image_url)
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // ignore
        } else {
          console.warn('Error fetching image for', item.Name, err)
        }
      } finally {
        if (!aborted) setLoadingImage(false)
      }
    }

    // Only fetch if there's no image_url yet
    if (!item.image_url) {
      fetchImage()
    }

    return () => {
      aborted = true
      controller.abort()
    }
  }, [item.Name, item.image_url])

  const imgAlt = item.Name ?? 'attraction image'
  const placeholder = 'https://placehold.co/600x400?text=No+image'

  return (
    <article className="bg-white rounded-lg shadow p-3">
      {imageUrl ? (
        <img
          className="w-full h-40 object-cover rounded-md mb-3"
          src={imageUrl}
          alt={imgAlt}
          onError={() => {
            // fallback to placeholder if fetched image fails to load
            if (imageUrl !== placeholder) setImageUrl(placeholder)
          }}
        />
      ) : loadingImage ? (
        <div className="w-full h-40 bg-slate-100 rounded-md mb-3 flex items-center justify-center text-slate-400">
          Loading image...
        </div>
      ) : (
        <div className="w-full h-40 bg-slate-100 rounded-md mb-3 flex items-center justify-center text-slate-400">
          No image
        </div>
      )}
      <h3 className="font-semibold">{item.Name}</h3>
      <p className="text-sm text-slate-500">{item.Address ?? 'No address available'}</p>
      <p className="mt-2 text-sm text-slate-700">{item.Tags ?? ''}</p>
    </article>
  )
}