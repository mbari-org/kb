import { FIELDS } from '@/lib/config/fields.js'
import { isJsonEqual, pick } from '@/lib/utils'

const { CAPTION, CREDIT, ID, IS_PRIMARY, MEDIA_TYPE, URL } = FIELDS.MEDIA

const mediaItemFields = mediaItem => pick(mediaItem, [ID, CAPTION, CREDIT, IS_PRIMARY, MEDIA_TYPE, URL])
const mediaItemsEqual = (a, b) => isJsonEqual(mediaItemFields(a), mediaItemFields(b))

const EMPTY_MEDIA_ITEM = {
  url: '',
  credit: '',
  caption: '',
  isPrimary: false,
}

export { EMPTY_MEDIA_ITEM, mediaItemFields, mediaItemsEqual }
