import { isJsonEqual, pickFields } from '@/lib/util'

const MEDIA_ITEM_FIELDS = ['url', 'credit', 'caption', 'isPrimary']
const mediaItemFields = mediaItem => pickFields(mediaItem, MEDIA_ITEM_FIELDS)
const mediaItemsEqual = (a, b) => isJsonEqual(mediaItemFields(a), mediaItemFields(b))

const EMPTY_MEDIA_ITEM = {
  url: '',
  credit: '',
  caption: '',
  isPrimary: false,
}

export { EMPTY_MEDIA_ITEM, mediaItemFields, mediaItemsEqual }
