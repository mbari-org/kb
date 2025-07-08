import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/api/media'

import { CONCEPT_STATE } from '@/lib/constants'

import { pick } from '@/lib/utils'

const saveMedia = ([submit, { concept, updateInfo }]) => {
  const { hasUpdated, updatedValue } = updateInfo

  if (!hasUpdated('media')) {
    return []
  }

  const mediaUpdates = updatedValue('media')

  const submitters = mediaUpdates.reduce((acc, stagedItem) => {
    const mediaItem = pick(stagedItem, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])

    switch (stagedItem.action) {
      case CONCEPT_STATE.MEDIA_ITEM.ADD: {
        const params = {
          conceptName: concept.name,
          ...mediaItem,
        }
        acc.push(submit(createMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
        const params = [stagedItem.id, mediaItem]
        acc.push(submit(updateMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
        acc.push(submit(deleteMediaItem, stagedItem.id))
        return acc
      }

      default:
        return acc
    }
  }, [])

  return submitters
}

export default saveMedia
