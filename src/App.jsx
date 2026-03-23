import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { useBookmarks } from './hooks/useBookmarks'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const { bookmarks, loading, error, refetch, lastFetched } = useBookmarks()

  return (
    <ThemeProvider>
      <Layout bookmarks={bookmarks} onRefresh={refetch} loading={loading}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                bookmarks={bookmarks}
                loading={loading}
                error={error}
                lastFetched={lastFetched}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
