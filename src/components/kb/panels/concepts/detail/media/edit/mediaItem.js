import { isJsonEqual, pick } from '@/lib/util'

const mediaItemFields = mediaItem =>
  pick(mediaItem, ['id', 'caption', 'credit', 'isPrimary', 'url'])
const mediaItemsEqual = (a, b) => isJsonEqual(mediaItemFields(a), mediaItemFields(b))

const EMPTY_MEDIA_ITEM = {
  url: '',
  credit: '',
  caption: '',
  isPrimary: false,
}

export { EMPTY_MEDIA_ITEM, mediaItemFields, mediaItemsEqual }
