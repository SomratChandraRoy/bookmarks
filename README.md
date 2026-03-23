# 📚 Bookmarks Viewer

A modern, production-ready React application to view, search, download, and preview your exported browser bookmarks. Built with React 18, Tailwind CSS, Framer Motion, and Vite.

[![CI/CD](https://github.com/SomratChandraRoy/bookmarks/actions/workflows/ci.yml/badge.svg)](https://github.com/SomratChandraRoy/bookmarks/actions/workflows/ci.yml)

---

## ✨ Features

- 📂 **Hierarchical viewer** — Browse bookmarks in collapsible folder tree, just like a browser
- 🔍 **Search & filter** — Instant full-text search across titles and URLs
- 🎨 **Dark / Light mode** — System preference detection + manual toggle
- 📱 **Responsive design** — Works on mobile, tablet, and desktop
- ⬇️ **Export** — Download as HTML (Netscape), JSON, or CSV
- 👁️ **Preview mode** — Click any bookmark to preview it before opening
- 🌐 **Grid view** — Switch between tree and flat grid layout
- 🔄 **Auto-sync** — Fetches latest `bookmarks.html` from this GitHub repo on load
- ✏️ **Edit via GitHub** — Update `bookmarks.html` in the repo; app refreshes automatically
- 🚀 **Production-ready** — Docker, nginx, GitHub Actions CI/CD

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Containerization | Docker + nginx |
| CI/CD | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Local Development

```bash
# Clone the repo
git clone https://github.com/SomratChandraRoy/bookmarks.git
cd bookmarks

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview  # preview the production build locally
```

### Docker

```bash
# Build and run with Docker
docker build -t bookmarks-viewer .
docker run -p 8080:80 bookmarks-viewer

# Or with Docker Compose
docker compose up -d
# → http://localhost:8080
```

---

## 📝 Updating Your Bookmarks

1. Export bookmarks from your browser (Brave, Chrome, Firefox, Edge) as HTML
2. For Brave export, replace `public/bravebookmarks.html` (preferred source used by the app)
3. You can still use `public/bookmarks.html` as a fallback source
4. Commit and push — the app auto-fetches from `main` on load

Or click **Edit on GitHub** in the app header to update bookmark source files in the repo (`public/bravebookmarks.html` preferred, `public/bookmarks.html` fallback).

---

## 🔧 Configuration

The app fetches bookmarks from:
```
https://raw.githubusercontent.com/SomratChandraRoy/bookmarks/main/public/bravebookmarks.html
```

If that remote source is unavailable, the app automatically falls back to:
- `public/bookmarks.html` on GitHub
- `/bravebookmarks.html` served locally
- `/bookmarks.html` served locally

To change the source, edit `src/hooks/useBookmarks.js`:
```js
const REMOTE_BOOKMARKS_URLS = [
  'https://raw.githubusercontent.com/<owner>/<repo>/main/public/bravebookmarks.html',
  'https://raw.githubusercontent.com/<owner>/<repo>/main/public/bookmarks.html',
]
```

---

## 📦 Project Structure

```
bookmarks/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BookmarkFolder.jsx   # Collapsible folder with children
│   │   ├── BookmarkItem.jsx     # Single bookmark link card
│   │   ├── ExportMenu.jsx       # Download dropdown (HTML/JSON/CSV)
│   │   ├── Header.jsx           # App header with actions
│   │   ├── Layout.jsx           # Page layout wrapper
│   │   ├── PreviewModal.jsx     # Bookmark preview modal
│   │   ├── SearchBar.jsx        # Search input
│   │   └── StatsBar.jsx         # Stats (total links, folders, last sync)
│   ├── context/
│   │   └── ThemeContext.jsx     # Dark/light theme context
│   ├── hooks/
│   │   ├── useBookmarks.js      # Fetch + parse bookmarks.html
│   │   └── useClickOutside.js   # Click outside hook
│   ├── pages/
│   │   ├── Home.jsx             # Main page
│   │   └── NotFound.jsx         # 404 page
│   ├── utils/
│   │   ├── exportBookmarks.js   # HTML/JSON/CSV export helpers
│   │   └── parseBookmarks.js    # Netscape HTML parser
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── bookmarks.html               # Your exported bookmarks
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── vite.config.js
├── tailwind.config.js
└── .github/workflows/ci.yml
```

---

## 🚢 Deployment on Appwrite

Appwrite supports static site hosting. To deploy:

1. Build the app: `npm run build`
2. Install Appwrite CLI: `npm install -g appwrite-cli`
3. Login: `appwrite login`
4. Create a project in Appwrite Console
5. Deploy: `appwrite deploy hosting --path ./dist`

Or use the **Sites** feature in Appwrite Console to connect your GitHub repo for automatic deployments.

---

## 🐳 Kubernetes Deployment

Basic K8s manifests:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookmarks-viewer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: bookmarks-viewer
  template:
    metadata:
      labels:
        app: bookmarks-viewer
    spec:
      containers:
        - name: bookmarks-viewer
          image: ghcr.io/somratchandraroy/bookmarks:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: bookmarks-viewer
spec:
  selector:
    app: bookmarks-viewer
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
```

---

## 📋 CI/CD

GitHub Actions automatically:
- Runs ESLint on every push/PR
- Builds the production bundle
- Builds the Docker image (on `main` branch)

Workflow file: `.github/workflows/ci.yml`

---

## 📄 License

MIT — feel free to use and modify.
