import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileJson, FileText, Sheet } from 'lucide-react'
import { exportAsHTML, exportAsJSON, exportAsCSV } from '../utils/exportBookmarks'
import { useClickOutside } from '../hooks/useClickOutside'

const FORMATS = [
  {
    id: 'html',
    label: 'HTML (Netscape)',
    description: 'Import into any browser',
    Icon: FileText,
    action: bookmarks => exportAsHTML(bookmarks),
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Structured data format',
    Icon: FileJson,
    action: bookmarks => exportAsJSON(bookmarks),
  },
  {
    id: 'csv',
    label: 'CSV (Flat list)',
    description: 'Open in spreadsheets',
    Icon: Sheet,
    action: bookmarks => exportAsCSV(bookmarks),
  },
]

export default function ExportMenu({ bookmarks, fullWidth }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className={`btn-primary ${fullWidth ? 'w-full justify-center' : ''}`}
      >
        <Download className="w-4 h-4" />
        Export
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
          >
            {FORMATS.map(({ id, label, description, Icon, action }) => (
              <button
                key={id}
                onClick={() => {
                  action(bookmarks)
                  setOpen(false)
                }}
                className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Icon className="w-4 h-4 mt-0.5 text-indigo-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {description}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
