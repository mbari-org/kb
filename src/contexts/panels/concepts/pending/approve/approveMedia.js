import { ACTION } from '@/lib/constants'
import { createError } from '@/lib/errors'

const approveMedia = (concept, item) => {
  switch (item.action) {
    case ACTION.ADD: {
      const exists = concept.media.some(media => media.url === item.newValue)
      if (!exists) {
        const mediaItem = { url: item.newValue, credit: '', caption: '', isPrimary: false }
        concept.media = [...concept.media, mediaItem]
      }
      break
    }

    case ACTION.DELETE: {
      concept.media = concept.media.filter(media => media.url !== item.oldValue)
      break
    }

    case ACTION.EDIT: {
      concept.media = concept.media.map(media =>
        media.url === item.oldValue ? { ...media, url: item.newValue } : media
      )
      break
    }

    default:
      throw createError(
        'Invalid Pending Action',
        `Cannot approve media with invalid action: ${item.action}`,
        { item }
      )
  }
}

export default approveMedia
