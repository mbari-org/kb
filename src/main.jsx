import { createRoot } from 'react-dom/client'

import App from '@/components/App'

const addIcon = (rel, file, sizes) => {
  const link = document.createElement('link')
  link.rel = rel
  link.type = 'image/png'
  if (sizes) link.sizes = sizes
  link.href = `${import.meta.env.BASE_URL}${file}`
  document.head.appendChild(link)
}

addIcon('icon', 'favicon-32.png', '32x32')
addIcon('icon', 'favicon-192.png', '192x192')
addIcon('apple-touch-icon', 'apple-touch-icon.png')

createRoot(document.getElementById('root')).render(<App />)
