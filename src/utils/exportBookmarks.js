import { flattenBookmarks } from './parseBookmarks'

/**
 * Trigger a browser download of a blob.
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export bookmarks as the original Netscape HTML format.
 */
export function exportAsHTML(items, filename = 'bookmarks.html') {
  function renderDL(nodes, indent = 4) {
    const pad = ' '.repeat(indent)
    let out = `${' '.repeat(indent - 4)}<DL><p>\n`
    for (const node of nodes) {
      if (node.type === 'folder') {
        out += `${pad}<DT><H3>${escapeHtml(node.title)}</H3>\n`
        out += renderDL(node.children || [], indent + 4)
      } else {
        const addDate = node.addDate ? ` ADD_DATE="${node.addDate}"` : ''
        out += `${pad}<DT><A HREF="${escapeHtml(node.url)}"${addDate}>${escapeHtml(node.title)}</A>\n`
      }
    }
    out += `${' '.repeat(indent - 4)}</DL><p>\n`
    return out
  }

  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
${renderDL(items)}
`
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  downloadBlob(blob, filename)
}

/**
 * Export bookmarks as JSON.
 */
export function exportAsJSON(items, filename = 'bookmarks.json') {
  const json = JSON.stringify(items, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  downloadBlob(blob, filename)
}

/**
 * Export bookmarks as CSV (flat list of links).
 */
export function exportAsCSV(items, filename = 'bookmarks.csv') {
  const links = flattenBookmarks(items)
  const header = 'Title,URL,AddDate\n'
  const rows = links
    .map(link => {
      const date = link.addDate
        ? new Date(link.addDate * 1000).toISOString()
        : ''
      return `"${escapeCSV(link.title)}","${escapeCSV(link.url || '')}","${date}"`
    })
    .join('\n')

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, filename)
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeCSV(str) {
  return str.replace(/"/g, '""')
}
