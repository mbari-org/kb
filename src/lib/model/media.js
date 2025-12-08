import { displayItem, stagedEdits } from '@/lib/concept/state/staged'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

const mediaItemEdits = ({ initial, staged }) =>
  stagedEdits({
    stateTypes: CONCEPT_STATE.MEDIA_ITEM,
    displayFields: MEDIA_DISPLAY_FIELDS,
    initial,
    staged,
  })

const mediaItemFields = mediaItem => displayItem(mediaItem, MEDIA_DISPLAY_FIELDS)

export { getPrimary, hasPrimary, isPrimary, mediaItemEdits, mediaItemFields }
