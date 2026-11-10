import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ADD, DELETE, EDIT } = CONCEPT_STATE.MEDIA_ITEM

const byUrl = (a, b) => a.url.localeCompare(b.url)

// Mirrors ONI media semantics: adds and edits apply immediately for any user with write
//  access (a maintainer's add exists as a row pending approval), deletes apply only for admins.
const applyMediaResults = ({ concept, isAdmin, result }) => {
  switch (result.action) {
    case ADD:
      concept.media = [...concept.media, result.response].sort(byUrl)
      break
    case EDIT: {
      const [mediaId] = result.params
      concept.media = concept.media.map(item => (item.id === mediaId ? result.response : item)).sort(byUrl)
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
