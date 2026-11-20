import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/api/media'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { FIELDS } from '@/lib/config/fields.js'

import { getMediaType } from '@/lib/model/media'
import { drop, pick } from '@/lib/utils'

const { MEDIA } = FIELDS

const buildMediaItemPayload = (update, { includeMediaType }) => {
  const mediaType = includeMediaType ? update.mediaType || getMediaType(update.url) : undefined
  const updateWithType = includeMediaType ? { ...update, mediaType } : update

  let mediaItem = pick(updateWithType, [
    MEDIA.CAPTION,
    MEDIA.CREDIT,
    MEDIA.IS_PRIMARY,
    MEDIA.MEDIA_TYPE,
    MEDIA.URL,
  ])
  if (!includeMediaType || mediaItem[MEDIA.MEDIA_TYPE] == null) {
    mediaItem = drop(mediaItem, [MEDIA.MEDIA_TYPE])
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
      const mediaItem = pick(item, [MEDIA.CAPTION, MEDIA.CREDIT, MEDIA.IS_PRIMARY, MEDIA.URL])
      if (currentMediaType) {
        mediaItem[MEDIA.MEDIA_TYPE] = currentMediaType
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
