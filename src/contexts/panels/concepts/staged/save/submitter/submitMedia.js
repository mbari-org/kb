import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/api/media'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import { createError } from '@/lib/errors'
import { getMediaType } from '@/lib/model/media'
import { drop, pick } from '@/lib/utils'

const submitMedia = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, initialValue, updatedValue } = updatesInfo

  if (!hasUpdated(CONCEPT.FIELD.MEDIA)) {
    return []
  }

  const submitMediaItem = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params)
      .then(response => ({
        field: CONCEPT.FIELD.MEDIA,
        response,
        ...trackerInfo,
      }))
      .catch(error => ({
        field: CONCEPT.FIELD.MEDIA,
        error: createError(
          'Media Operation Failed',
          `Failed to ${trackerInfo.action} item for concept ${concept.name}`,
          {
            action: trackerInfo.action,
            conceptName: concept.name,
            index: trackerInfo.index,
            mediaId: trackerInfo.update.id,
            mediaType: trackerInfo.update.mediaType,
          },
          error
        ),
        ...trackerInfo,
      }))

  const getMediaId = (update, index) =>
    update.id || initialValue(CONCEPT.FIELD.MEDIA)?.[index]?.id

  const buildMediaItemPayload = (update, { includeMediaType }) => {
    const mediaType = includeMediaType ? (update.mediaType || getMediaType(update.url)) : undefined
    const updateWithType = includeMediaType ? { ...update, mediaType } : update

    // Build media item payload, omitting mediaType entirely if not requested or null.
    let mediaItem = pick(updateWithType, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])
    if (!includeMediaType || mediaItem.mediaType == null) {
      mediaItem = drop(mediaItem, 'mediaType')
    }

    return { mediaItem, updateWithType }
  }

  const mediaAdd = (update, index) => {
    const { mediaItem, updateWithType } = buildMediaItemPayload(update, { includeMediaType: true })

    const params = {
      conceptName: concept.name,
      ...mediaItem,
    }
    const trackerInfo = {
      action: CONCEPT_STATE.MEDIA_ITEM.ADD,
      index,
      params,
      update: updateWithType,
    }
    return submitMediaItem(createMediaItem, trackerInfo)
  }

  const mediaEdit = (update, index) => {
    const { mediaItem, updateWithType } = buildMediaItemPayload(update, { includeMediaType: false })
    const mediaId = getMediaId(updateWithType, index)

    const params = [mediaId, mediaItem]
    const trackerInfo = {
      action: CONCEPT_STATE.MEDIA_ITEM.EDIT,
      index,
      params,
      update,
    }
    return submitMediaItem(updateMediaItem, trackerInfo)
  }

  const mediaDelete = (update, index) => {
    const params = getMediaId(update, index)

    const trackerInfo = {
      action: CONCEPT_STATE.MEDIA_ITEM.DELETE,
      index,
      params,
      update,
    }
    return submitMediaItem(deleteMediaItem, trackerInfo)
  }

  const actionSubmitter = {
    [CONCEPT_STATE.MEDIA_ITEM.ADD]: mediaAdd,
    [CONCEPT_STATE.MEDIA_ITEM.EDIT]: mediaEdit,
    [CONCEPT_STATE.MEDIA_ITEM.DELETE]: mediaDelete,
  }

  const stagedMedia = updatedValue(CONCEPT.FIELD.MEDIA)

  const submitters = stagedMedia.reduce((acc, update, index) => {
    const submitter = actionSubmitter[update.action]
    if (!submitter) return acc
    acc.push(submitter(update, index))
    return acc
  }, [])

  return submitters
}

export default submitMedia
