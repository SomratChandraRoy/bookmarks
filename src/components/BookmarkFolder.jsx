import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import BookmarkItem from './BookmarkItem'

const FOLDER_COLORS = [
  'from-indigo-500 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-purple-500',
]

function getColor(title) {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length]
}

export default function BookmarkFolder({ folder, depth = 0, onPreview, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? depth === 0)
  const linkCount = countLinks(folder.children || [])
  const colorClass = getColor(folder.title)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden border ${
        depth === 0
          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm'
          : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'
      }`}
    >
      {/* Folder header */}
      <motion.button
        whileHover={{ backgroundColor: 'rgba(99,102,241,0.06)' }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      >
        {/* Folder icon with gradient */}
        <div
          className={`shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-sm`}
        >
          {open ? (
            <FolderOpen className="w-4 h-4 text-white" />
          ) : (
            <Folder className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Title & count */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate block">
            {folder.title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {linkCount} bookmark{linkCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Folder contents */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-3 pb-3 ${depth > 0 ? 'pt-1' : 'pt-0'} space-y-1.5`}>
              {(folder.children || []).map(child =>
                child.type === 'folder' ? (
                  <BookmarkFolder
                    key={child.id}
                    folder={child}
                    depth={depth + 1}
                    onPreview={onPreview}
                    defaultOpen={false}
                  />
                ) : (
                  <BookmarkItem key={child.id} item={child} onPreview={onPreview} />
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function countLinks(items) {
  let count = 0
  for (const item of items) {
    if (item.type === 'link') count++
    else if (item.type === 'folder') count += countLinks(item.children || [])
  }
  return count
}
