import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { getItemMediaType } from '@/lib/model/media'

const { ADD, DELETE, EDIT } = CONCEPT_STATE.MEDIA_ITEM

const byUrl = (a, b) => a.url.localeCompare(b.url)

const clearSameTypePrimaries = (media, primaryItem) => {
  if (!primaryItem.isPrimary) return media
  const primaryType = getItemMediaType(primaryItem)
  return media.map(item =>
    item.id !== primaryItem.id && getItemMediaType(item) === primaryType ? { ...item, isPrimary: false } : item
  )
}

const applyMediaResults = ({ concept, isAdmin, result }) => {
  switch (result.action) {
    case ADD: {
      const added = result.response
      concept.media = [...clearSameTypePrimaries(concept.media, added), added].sort(byUrl)
      break
    }
    case EDIT: {
      const [mediaId] = result.params
      const updated = result.response
      concept.media = clearSameTypePrimaries(concept.media, updated)
        .map(item => (item.id === mediaId ? updated : item))
        .sort(byUrl)
      break
    }
    case DELETE:
      if (isAdmin) {
        concept.media = concept.media.filter(item => item.id !== result.params)
      }
      break
    default:
      break
  }
}

export default applyMediaResults
