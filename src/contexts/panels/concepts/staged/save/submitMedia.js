import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/api/media'

import { CONCEPT_STATE } from '@/lib/constants'

import { pick } from '@/lib/utils'

const submitMedia = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  if (!hasUpdated('media')) {
    return []
  }

  const mediaUpdates = updatedValue('media')

  const submitters = mediaUpdates.reduce((acc, stagedItem) => {
    const mediaItem = pick(stagedItem, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])

    switch (stagedItem.action) {
      case CONCEPT_STATE.MEDIA.ADD: {
        const params = {
          conceptName: concept.name,
          ...mediaItem,
        }
        acc.push(submit(createMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA.EDIT: {
        const params = [stagedItem.id, mediaItem]
        acc.push(submit(updateMediaItem, params))
        return acc
      }

      case CONCEPT_STATE.MEDIA.DELETE: {
        acc.push(submit(deleteMediaItem, stagedItem.id))
        return acc
      }

      default:
        return acc
    }
  }, [])

  return submitters
}

export default submitMedia
