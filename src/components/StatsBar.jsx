import { motion } from 'framer-motion'
import { Link2, FolderOpen, Clock } from 'lucide-react'

function Stat({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          {value}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </motion.div>
  )
}

export default function StatsBar({ totalLinks, totalFolders, lastFetched }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3"
    >
      <Stat
        icon={Link2}
        label="Bookmarks"
        value={totalLinks.toLocaleString()}
        color="bg-indigo-500"
      />
      <Stat
        icon={FolderOpen}
        label="Folders"
        value={totalFolders.toLocaleString()}
        color="bg-purple-500"
      />
      {lastFetched && (
        <Stat
          icon={Clock}
          label="Last synced"
          value={lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          color="bg-emerald-500"
        />
      )}
    </motion.div>
  )
}
