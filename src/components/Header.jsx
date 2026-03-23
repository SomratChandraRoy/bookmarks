import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bookmark,
  Download,
  Moon,
  Sun,
  RefreshCw,
  Github,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import ExportMenu from './ExportMenu'

export default function Header({ bookmarks, onRefresh, loading }) {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow"
            >
              <Bookmark className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Bookmarks
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2">
            <ExportMenu bookmarks={bookmarks} />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={loading}
              title="Refresh bookmarks"
              className="btn-secondary"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden md:inline">Refresh</span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://raw.githubusercontent.com/SomratChandraRoy/bookmarks/main/public/bravebookmarks.html"
              target="_blank"
              rel="noopener noreferrer"
              title="Download original Brave bookmarks HTML"
              className="btn-secondary"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Download Source HTML</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/SomratChandraRoy/bookmarks"
              target="_blank"
              rel="noopener noreferrer"
              title="Edit on GitHub"
              className="btn-secondary"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">Edit on GitHub</span>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              title="Toggle theme"
              className="btn-secondary !px-2.5"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden btn-secondary !px-2.5"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden pb-4 flex flex-col gap-2"
          >
            <ExportMenu bookmarks={bookmarks} fullWidth />
            <button
              onClick={() => { onRefresh(); setMobileOpen(false) }}
              disabled={loading}
              className="btn-secondary w-full justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href="https://raw.githubusercontent.com/SomratChandraRoy/bookmarks/main/public/bravebookmarks.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Download Source HTML
            </a>
            <a
              href="https://github.com/SomratChandraRoy/bookmarks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center"
            >
              <Github className="w-4 h-4" />
              Edit on GitHub
            </a>
            <button
              onClick={toggleTheme}
              className="btn-secondary w-full justify-center"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </motion.div>
        )}
      </div>
    </header>
  )
}
