import { useState, useEffect, useCallback } from 'react'
import { parseBookmarks } from '../utils/parseBookmarks'

const REMOTE_BOOKMARKS_URLS = [
  'https://raw.githubusercontent.com/SomratChandraRoy/bookmarks/main/public/bravebookmarks.html',
  'https://raw.githubusercontent.com/SomratChandraRoy/bookmarks/main/public/bookmarks.html',
]

const LOCAL_BOOKMARKS_PATHS = ['/bravebookmarks.html', '/bookmarks.html']

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const fetchBookmarks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Try remote first, preferring Brave export; fall back to local files in development
      let html
      try {
        for (const url of REMOTE_BOOKMARKS_URLS) {
          const res = await fetch(`${url}?t=${Date.now()}`)
          if (res.ok) {
            html = await res.text()
            break
          }
          console.warn(`Bookmark source unavailable: ${url} (HTTP ${res.status})`)
        }
        if (!html) throw new Error('Could not load remote bookmarks source')
      } catch {
        for (const path of LOCAL_BOOKMARKS_PATHS) {
          const localRes = await fetch(path)
          if (localRes.ok) {
            html = await localRes.text()
            break
          }
          console.warn(`Local bookmark source unavailable: ${path} (HTTP ${localRes.status})`)
        }
        if (!html) {
          throw new Error(
            `Could not load bookmarks from any source. Tried: ${[
              ...REMOTE_BOOKMARKS_URLS,
              ...LOCAL_BOOKMARKS_PATHS,
            ].join(', ')}`,
          )
        }
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
