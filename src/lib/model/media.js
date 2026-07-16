import { displayItem, stagedEdits } from '@/lib/concept/state/staged'
import { MEDIA } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { IMAGE, VIDEO, ICON } = MEDIA.TYPE

// Derive a canonical media type from mimeType and/or URL.
const deriveMediaType = ({ mimeType, url } = {}) => {
  const mime = mimeType?.toLowerCase()

  if (mime) {
    if (mime.startsWith('image/')) {
      if (mime.includes('icon')) return ICON
      return IMAGE
    }
    if (mime.startsWith('video/')) {
      return VIDEO
    }
  }

  return getMediaType(url)
}

const getMediaType = url => {
  try {
    const { pathname } = new URL(url)
    const match = pathname.toLowerCase().match(/\.([a-z0-9]+)$/)
    if (!match) return null

    const extension = match[1]
    if (MEDIA.EXTENSIONS.ICON.has(extension)) return ICON
    if (MEDIA.EXTENSIONS.IMAGE.has(extension)) return IMAGE
    if (MEDIA.EXTENSIONS.VIDEO.has(extension)) return VIDEO

    return null
  } catch {
    return null
  }
}


const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

// Prefer explicit mediaType on the item; fall back to derived type from mimeType/URL.
// Normalize explicit mediaType to match the canonical values in MEDIA_TYPE.
const getItemMediaType = item => {
  const raw = item?.mediaType
  if (typeof raw === 'string') {
    const upper = raw.toUpperCase()
    if (MEDIA.ORDER.includes(upper)) {
      return upper
    }
  }
  return deriveMediaType(item)
}

const mediaOfType = (media, type) => media.filter(item => getItemMediaType(item) === type)

const getPrimaryOfType = (media, type) => mediaOfType(media, type).find(isPrimary)

const hasPrimaryOfType = (media, type) => !!getPrimaryOfType(media, type)

const isPrimary = mediaItem => !!mediaItem.isPrimary

const mediaItemEdits = ({ initial, staged }) =>
  stagedEdits({
    stateTypes: CONCEPT_STATE.MEDIA_ITEM,
    displayFields: MEDIA.DISPLAY,
    initial,
    staged,
  })

const mediaItemFields = mediaItem => displayItem(mediaItem, MEDIA.DISPLAY)

const typeMediaItem = mediaItem => ({
  ...mediaItem,
  mediaType: getItemMediaType(mediaItem),
})

export {
  deriveMediaType,
  getItemMediaType,
  getMediaType,
  getPrimary,
  getPrimaryOfType,
  hasPrimary,
  hasPrimaryOfType,
  isPrimary,
  mediaItemEdits,
  mediaItemFields,
  mediaOfType,
  typeMediaItem,
}

