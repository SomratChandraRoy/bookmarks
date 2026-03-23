/**
 * Parses a Netscape Bookmark HTML file into a structured tree of folders and links.
 * @param {string} html - Raw HTML string of the bookmarks file
 * @returns {{ id: string, type: 'folder'|'link', title: string, url?: string, icon?: string, addDate?: number, children?: Array }[]}
 */
export function parseBookmarks(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  let idCounter = 0
  const nextId = () => `bm-${++idCounter}`

  function parseDL(dlElement) {
    const items = []
    const children = Array.from(dlElement.children)

    for (let i = 0; i < children.length; i++) {
      const el = children[i]

      if (el.tagName === 'DT') {
        const h3 = el.querySelector(':scope > h3')
        const anchor = el.querySelector(':scope > a')

        if (h3) {
          // It's a folder
          const folderItem = {
            id: nextId(),
            type: 'folder',
            title: h3.textContent.trim(),
            addDate: h3.getAttribute('add_date')
              ? parseInt(h3.getAttribute('add_date'), 10)
              : null,
            children: [],
          }

          // Look for the next sibling DD or DL
          const nextEl = children[i + 1]
          if (nextEl) {
            let dl = null
            if (nextEl.tagName === 'DD') {
              dl = nextEl.querySelector('dl')
            } else if (nextEl.tagName === 'DL') {
              dl = nextEl
            } else {
              // DL might be directly inside DT
              dl = el.querySelector(':scope > dl')
            }
            if (dl) {
              folderItem.children = parseDL(dl)
            }
          } else {
            // Check inside DT
            const dl = el.querySelector(':scope > dl')
            if (dl) {
              folderItem.children = parseDL(dl)
            }
          }

          items.push(folderItem)
        } else if (anchor) {
          // It's a link
          const href = anchor.getAttribute('href') || ''
          if (href && href !== 'javascript:void(0)') {
            items.push({
              id: nextId(),
              type: 'link',
              title: anchor.textContent.trim() || href,
              url: href,
              icon: anchor.getAttribute('icon') || null,
              addDate: anchor.getAttribute('add_date')
                ? parseInt(anchor.getAttribute('add_date'), 10)
                : null,
            })
          }
        }
      }
    }

    return items
  }

  const rootDL = doc.querySelector('dl')
  if (!rootDL) return []

  return parseDL(rootDL)
}

/**
 * Flatten a bookmark tree into a list of links (no folders).
 */
export function flattenBookmarks(items) {
  const links = []
  for (const item of items) {
    if (item.type === 'link') {
      links.push(item)
    } else if (item.type === 'folder' && item.children?.length) {
      links.push(...flattenBookmarks(item.children))
    }
  }
  return links
}

/**
 * Search bookmarks recursively by query string.
 */
export function searchBookmarks(items, query) {
  if (!query.trim()) return items
  const q = query.toLowerCase()

  return items.reduce((acc, item) => {
    if (item.type === 'link') {
      if (
        item.title.toLowerCase().includes(q) ||
        item.url?.toLowerCase().includes(q)
      ) {
        acc.push(item)
      }
    } else if (item.type === 'folder') {
      const filteredChildren = searchBookmarks(item.children || [], q)
      if (filteredChildren.length > 0 || item.title.toLowerCase().includes(q)) {
        acc.push({ ...item, children: filteredChildren })
      }
    }
    return acc
  }, [])
}

/**
 * Count total links recursively.
 */
export function countLinks(items) {
  let count = 0
  for (const item of items) {
    if (item.type === 'link') count++
    else if (item.type === 'folder') count += countLinks(item.children || [])
  }
  return count
}

/**
 * Count total folders recursively.
 */
export function countFolders(items) {
  let count = 0
  for (const item of items) {
    if (item.type === 'folder') {
      count++
      count += countFolders(item.children || [])
    }
  }
  return count
}
