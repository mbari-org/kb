import { ACTION } from '@/lib/constants/constants'

const rejectMedia = (concept, pendingItem) => {
  switch (pendingItem.action) {
    case ACTION.ADD: {
      concept.media = (concept.media || []).filter(media => media.url !== pendingItem.newValue)
      break
    }

    case ACTION.DELETE: {
      const exists = (concept.media || []).some(media => media.url === pendingItem.oldValue)
      if (!exists) {
        const mediaItem = { url: pendingItem.oldValue, credit: '', caption: '', isPrimary: false }
        concept.media = [...(concept.media || []), mediaItem]
      }
      break
    }

    case ACTION.EDIT: {
      concept.media = (concept.media || []).map(media =>
        media.url === pendingItem.newValue ? { ...media, url: pendingItem.oldValue } : media
      )
      break
    }

    default:
      break
  }
}

export default rejectMedia
