import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, Globe, Link2 } from 'lucide-react'
import { useEffect } from 'react'

export default function PreviewModal({ item, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!item) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Modal header */}
          <div className="flex items-start gap-4 p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                {item.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {item.url}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Link display area */}
          <div className="p-5">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3 group">
              <Link2 className="w-4 h-4 text-gray-400 shrink-0" />
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate flex-1"
              >
                {item.url}
              </a>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <strong>Note:</strong> Bookmark previews open in a new tab for security reasons.
              Many sites block embedding due to their security policies (X-Frame-Options).
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-5 pb-5">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 justify-center"
            >
              <ExternalLink className="w-4 h-4" />
              Open Bookmark
            </a>
            <button onClick={onClose} className="btn-secondary flex-1 justify-center">
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
