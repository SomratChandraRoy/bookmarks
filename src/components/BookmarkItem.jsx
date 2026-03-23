import { motion } from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'
import { useState } from 'react'

const FAVICON_SERVICE = 'https://www.google.com/s2/favicons?domain='

function getFaviconUrl(url) {
  try {
    const { hostname } = new URL(url)
    return `${FAVICON_SERVICE}${hostname}&sz=32`
  } catch {
    return null
  }
}

export default function BookmarkItem({ item, onPreview }) {
  const [imgError, setImgError] = useState(false)
  const faviconUrl = !imgError && item.url ? getFaviconUrl(item.url) : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{
        y: -2,
        boxShadow: '0 8px 20px rgba(99,102,241,0.15)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bookmark-card group"
    >
      <div className="p-3 flex items-start gap-3">
        {/* Favicon */}
        <div className="shrink-0 w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden mt-0.5">
          {faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-5 h-5 object-contain"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <Globe className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => {
              if (onPreview) {
                e.preventDefault()
                onPreview(item)
              }
            }}
            className="block font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1
              hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {item.title}
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
            {item.url}
          </p>
        </div>

        {/* Open link */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in new tab"
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
            text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 p-1"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  )
}
