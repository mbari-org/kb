import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/api/media'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import { getMediaType } from '@/lib/model/media'
import { drop, pick } from '@/lib/utils'

const buildMediaItemPayload = (update, { includeMediaType }) => {
  const mediaType = includeMediaType ? update.mediaType || getMediaType(update.url) : undefined
  const updateWithType = includeMediaType ? { ...update, mediaType } : update

  let mediaItem = pick(updateWithType, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])
  if (!includeMediaType || mediaItem.mediaType == null) {
    mediaItem = drop(mediaItem, ['mediaType'])
  }

  return { mediaItem, updateWithType }
}

const mediaId = (item, effective) => {
  if (item.id != null) return item.id
  return effective.findMedia(item)?.id
}

const buildMediaSubmit = (op, effective) => {
  const { action, index, item } = op

  switch (action) {
    case CONCEPT_STATE.MEDIA_ITEM.ADD: {
      const { mediaItem, updateWithType } = buildMediaItemPayload(item, { includeMediaType: true })
      const params = {
        conceptName: effective.state.name,
        ...mediaItem,
      }
      return {
        apiFn: createMediaItem,
        params,
        tracker: {
          action,
          field: CONCEPT.FIELD.MEDIA,
          index,
          update: updateWithType,
        },
      }
    }

    case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
      const currentMediaType = getMediaType(item.url)
      const mediaItem = pick(item, ['caption', 'credit', 'isPrimary', 'url'])
      if (currentMediaType) {
        mediaItem.mediaType = currentMediaType
      }
      const params = [mediaId(item, effective), mediaItem]
      return {
        apiFn: updateMediaItem,
        params,
        tracker: {
          action,
          field: CONCEPT.FIELD.MEDIA,
          index,
          update: { ...item, mediaType: currentMediaType },
        },
      }
    }

    case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
      const params = mediaId(item, effective)
      return {
        apiFn: deleteMediaItem,
        params,
        tracker: {
          action,
          field: CONCEPT.FIELD.MEDIA,
          index,
          update: item,
        },
      }
    }

    default:
      throw new Error(`Unknown media action: ${action}`)
  }
}

export default buildMediaSubmit
