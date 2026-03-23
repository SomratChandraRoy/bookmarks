import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SearchBar({ value, onChange, count }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search bookmarks by title or URL…"
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200
          dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-transparent transition-all"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
      {count !== undefined && (
        <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {count} result{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}
