import { createMediaItem, deleteMediaItem, updateMediaItem } from '@/lib/api/media'

import { CONCEPT_STATE } from '@/lib/constants'

import { pick } from '@/lib/utils'
import { createError } from '@/lib/errors'

const submitMedia = ([submit, { concept, updatesInfo }]) => {
  const { hasUpdated, updatedValue } = updatesInfo

  if (!hasUpdated('media')) {
    return []
  }

  const submitMediaItem = (apiFn, trackerInfo) =>
    submit(apiFn, trackerInfo.params)
      .then(response => ({
        field: 'media',
        response,
        ...trackerInfo,
      }))
      .catch(error => ({
        field: 'media',
        error: createError(
          'Media Operation Failed',
          `Failed to ${getMediaActionMessage(trackerInfo.action)} media item for concept ${concept.name}`,
          {
            conceptName: concept.name,
            mediaId: trackerInfo.update.id,
            mediaType: trackerInfo.update.mediaType,
            action: trackerInfo.action,
            index: trackerInfo.index,
          },
          error
        ),
        ...trackerInfo,
      }))

  const getMediaActionMessage = action => {
    switch (action) {
      case CONCEPT_STATE.MEDIA_ITEM.ADD:
        return 'add'
      case CONCEPT_STATE.MEDIA_ITEM.EDIT:
        return 'update'
      case CONCEPT_STATE.MEDIA_ITEM.DELETE:
        return 'delete'
      default:
        return 'process'
    }
  }

  const mediaAdd = (update, index) => {
    const mediaItem = pick(update, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])
    const params = {
      conceptName: concept.name,
      ...mediaItem,
    }
    const trackerInfo = {
      action: CONCEPT_STATE.MEDIA_ITEM.ADD,
      index,
      params,
      update,
    }
    return submitMediaItem(createMediaItem, trackerInfo)
  }

  const mediaEdit = (update, index) => {
    const mediaItem = pick(update, ['caption', 'credit', 'isPrimary', 'mediaType', 'url'])
    const params = [update.id, mediaItem]
    const trackerInfo = {
      action: CONCEPT_STATE.MEDIA_ITEM.EDIT,
      index,
      params,
      update,
    }
    return submitMediaItem(updateMediaItem, trackerInfo)
  }

  const mediaDelete = (update, index) => {
    const params = update.id
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

  const submitters = updatedValue('media').reduce((acc, update, index) => {
    const submitter = actionSubmitter[update.action]
    if (!submitter) return acc
    acc.push(submitter(update, index))
    return acc
  }, [])

  return submitters
}

export default submitMedia
