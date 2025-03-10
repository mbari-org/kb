import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaBorder = (mediaItem, theme) => {
  const borderWidth = mediaItem?.action === CONCEPT_STATE.NO_ACTION ? '1px' : '3px'
  let borderColor
  switch (mediaItem?.action) {
    case CONCEPT_STATE.MEDIA.ADD:
      borderColor = theme.palette.primary.clean
      break
    case CONCEPT_STATE.MEDIA.EDIT:
      borderColor = theme.palette.primary.modified
      break
    case CONCEPT_STATE.MEDIA.DELETE:
      borderColor = theme.palette.primary.remove
      break
    default:
      borderColor = theme.palette.grey[300]
  }
  return `${borderWidth} solid ${borderColor}`
}

const mediaItemEdit = (mediaIndex, initialItem, stagedItem) => {
  const { action: stagedAction } = stagedItem

  if (stagedAction === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initialFields =
    stagedAction === CONCEPT_STATE.MEDIA.ADD ? null : mediaItemFields(initialItem)

  const stagedFields =
    stagedAction === CONCEPT_STATE.MEDIA.DELETE ? null : mediaItemFields(stagedItem)

  return [mediaIndex, stagedAction, initialFields, stagedFields]
}

const mediaItemEdits = (initial, staged) =>
  staged.map((stagedItem, stagedIndex) => {
    const initialItem = initial[stagedIndex]
    return mediaItemEdit(stagedIndex, initialItem, stagedItem)
  })

const mediaItemFields = mediaItem =>
  MEDIA_DISPLAY_FIELDS.reduce((fields, field) => {
    fields.push([field, mediaItem[field]])
    return fields
  }, [])

export { getPrimary, hasPrimary, isPrimary, mediaBorder, mediaItemEdits, mediaItemFields }
