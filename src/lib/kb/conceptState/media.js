import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

import { displayItem, fieldEdits } from '@/lib/kb/conceptState/field'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaItemEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.MEDIA,
    displayFields: MEDIA_DISPLAY_FIELDS,
    initial,
    staged,
  })

const mediaItemFields = mediaItem => displayItem(mediaItem, MEDIA_DISPLAY_FIELDS)

export { getPrimary, hasPrimary, isPrimary, mediaItemEdits, mediaItemFields }
