import { useState, useEffect, useCallback } from 'react'
import { parseBookmarks } from '../utils/parseBookmarks'

const BOOKMARKS_URL =
  'https://raw.githubusercontent.com/SomratChandraRoy/bookmarks/main/public/bookmarks.html'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const fetchBookmarks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Try remote first; fall back to local /bookmarks.html for development
      let html
      try {
        const res = await fetch(`${BOOKMARKS_URL}?t=${Date.now()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        html = await res.text()
      } catch {
        const localRes = await fetch('/bookmarks.html')
        if (!localRes.ok) throw new Error('Could not load bookmarks.html')
        html = await localRes.text()
      }
      const parsed = parseBookmarks(html)
      setBookmarks(parsed)
      setLastFetched(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  return { bookmarks, loading, error, refetch: fetchBookmarks, lastFetched }
}
