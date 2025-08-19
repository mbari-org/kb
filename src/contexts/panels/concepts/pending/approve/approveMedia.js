import { ACTION } from '@/lib/constants'

const approveMedia = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const exists = (concept.media || []).some(m => m.url === item.newValue)
      if (!exists) {
        const mediaItem = { url: item.newValue, credit: '', caption: '', isPrimary: false }
        concept.media = [...(concept.media || []), mediaItem]
      }
      break
    }

    case ACTION.DELETE: {
      concept.media = (concept.media || []).filter(m => m.url !== item.oldValue)
      break
    }

    case ACTION.EDIT: {
      concept.media = (concept.media || []).map(m =>
        m.url === item.oldValue ? { ...m, url: item.newValue } : m
      )
      break
    }

    default:
      throw new Error(`Invalid approval pending media action: ${item.action}`)
  }
}

export default approveMedia
