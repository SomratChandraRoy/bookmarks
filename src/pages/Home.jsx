import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, BookOpen, LayoutGrid, List, RefreshCw } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import BookmarkFolder from '../components/BookmarkFolder'
import BookmarkItem from '../components/BookmarkItem'
import PreviewModal from '../components/PreviewModal'
import StatsBar from '../components/StatsBar'
import { searchBookmarks, countLinks, countFolders, flattenBookmarks } from '../utils/parseBookmarks'

export default function Home({ bookmarks, loading, error, lastFetched }) {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState('tree') // 'tree' | 'flat'
  const [previewItem, setPreviewItem] = useState(null)

  const filtered = useMemo(
    () => (query ? searchBookmarks(bookmarks, query) : bookmarks),
    [bookmarks, query],
  )

  const flatLinks = useMemo(() => flattenBookmarks(filtered), [filtered])
  const totalLinks = useMemo(() => countLinks(bookmarks), [bookmarks])
  const totalFolders = useMemo(() => countFolders(bookmarks), [bookmarks])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full"
          style={{ borderWidth: 3 }}
        />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading bookmarks…</p>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 gap-4 text-center"
      >
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Failed to load bookmarks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
        </div>
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </motion.div>
    )
  }

  return (
    <>
      {/* Stats bar */}
      <StatsBar
        totalLinks={totalLinks}
        totalFolders={totalFolders}
        lastFetched={lastFetched}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-5">
        <SearchBar
          value={query}
          onChange={setQuery}
          count={query ? flatLinks.length : undefined}
        />
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('tree')}
            title="Tree view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'tree'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <List className="w-4 h-4" />
            Tree
          </button>
          <button
            onClick={() => setViewMode('flat')}
            title="Grid view"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'flat'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-3"
        >
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">
            {query ? `No bookmarks found for "${query}"` : 'No bookmarks found.'}
          </p>
          {query && (
            <button className="btn-secondary text-sm" onClick={() => setQuery('')}>
              Clear search
            </button>
          )}
        </motion.div>
      )}

      {/* Tree view */}
      {viewMode === 'tree' && filtered.length > 0 && (
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(item =>
              item.type === 'folder' ? (
                <BookmarkFolder
                  key={item.id}
                  folder={item}
                  depth={0}
                  onPreview={setPreviewItem}
                  defaultOpen={!query ? undefined : true}
                />
              ) : (
                <BookmarkItem key={item.id} item={item} onPreview={setPreviewItem} />
              ),
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Flat / Grid view */}
      {viewMode === 'flat' && filtered.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {flatLinks.map(item => (
              <BookmarkItem key={item.id} item={item} onPreview={setPreviewItem} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {previewItem && (
          <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
