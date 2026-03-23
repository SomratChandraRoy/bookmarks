import Header from './Header'

export default function Layout({ children, bookmarks, onRefresh, loading }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header bookmarks={bookmarks} onRefresh={onRefresh} loading={loading} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          Built with{' '}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            React
          </a>
          {' & '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Tailwind CSS
          </a>
          {' · '}
          <a
            href="https://github.com/SomratChandraRoy/bookmarks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
