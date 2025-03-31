import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/services/oni/api/media'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { prunePick } from '@/lib/util'

const updateMedia = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, updatedValue } = updateInfo

  if (!hasUpdated('media')) {
    return []
  }

  const mediaUpdates = updatedValue('media')

  const submitters = mediaUpdates.reduce((acc, stagedItem, index) => {
    const prunedItem = prunePick(stagedItem, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])

    switch (stagedItem.action) {
      case CONCEPT_STATE.MEDIA.ADD: {
        const params = {
          conceptName: concept.name,
          ...prunedItem,
        }
        acc.push(submit(createMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA.EDIT: {
        const mediaItemId = mediaUpdates.media.initial[index].id
        const params = [mediaItemId, prunedItem]
        acc.push(submit(updateMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA.DELETE: {
        const mediaItemId = mediaUpdates.media.initial[index].id
        acc.push(submit(deleteMediaItem, mediaItemId))
        return acc
      }

      default:
        return acc
    }
  }, [])

  return submitters
}

export default updateMedia
