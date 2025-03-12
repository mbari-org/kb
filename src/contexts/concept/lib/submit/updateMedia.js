import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/services/oni/api/media'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { prunePick, updatedFields } from '@/lib/util'

const prunedMediaItem = stagedItem =>
  prunePick(stagedItem, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])

const updateMedia = (concept, updates, submit) => {
  const mediaUpdates = updatedFields(updates, ['media'])

  if (!mediaUpdates) {
    return []
  }

  const submitters = mediaUpdates.media.staged.reduce((acc, stagedItem, index) => {
    switch (stagedItem.action) {
      case CONCEPT_STATE.MEDIA.ADD: {
        const params = {
          conceptName: concept.name,
          ...prunedMediaItem(stagedItem),
        }
        acc.push(() => submit(createMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA.EDIT: {
        const mediaItemId = mediaUpdates.media.initial[index].id
        const params = [mediaItemId, prunedMediaItem(stagedItem)]
        acc.push(() => submit(updateMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA.DELETE: {
        const mediaItemId = mediaUpdates.media.initial[index].id
        acc.push(() => submit(deleteMediaItem, mediaItemId))
        return acc
      }

      default:
        return acc
    }
  }, [])

  return submitters
}

export default updateMedia
