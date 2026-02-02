import { displayItem, stagedEdits } from '@/lib/concept/state/staged'
import { MEDIA_DISPLAY_FIELDS, MEDIA_EXTENSIONS, MEDIA_TYPES } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const [IMAGE, ICON, VIDEO] = MEDIA_TYPES

// Derive a canonical media type ('IMAGE', 'ICON', 'VIDEO') from mimeType and/or URL.
const deriveMediaType = ({ mimeType, url } = {}) => {
  const mime = mimeType?.toLowerCase()

  if (mime) {
    if (mime.startsWith('image/')) {
      // Treat icon-like mime types as ICON
      if (mime.includes('icon')) return ICON
      // Default image mime types to IMAGE
      return IMAGE
    }
    if (mime.startsWith('video/')) {
      return VIDEO
    }
  }

  // Fallback to URL-based detection
  return getMediaType(url)
}

const getMediaType = url => {
  try {
    const { pathname } = new URL(url)
    const match = pathname.toLowerCase().match(/\.([a-z0-9]+)$/)
    if (!match) return null

    const extension = match[1]
    if (MEDIA_EXTENSIONS.ICON.has(extension)) return ICON
    if (MEDIA_EXTENSIONS.IMAGE.has(extension)) return IMAGE
    if (MEDIA_EXTENSIONS.VIDEO.has(extension)) return VIDEO

    return null
  } catch {
    return null
  }
}

const checkMediaUrlExists = url => {
  const mediaType = getMediaType(url)

  if (mediaType === IMAGE) {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  if (mediaType === VIDEO) {
    return new Promise(resolve => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => resolve(true)
      video.onerror = () => resolve(false)
      video.src = url
    })
  }

  if (mediaType === ICON) {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

const getPrimary = media => media.find(mediaItem => isPrimary(mediaItem))

const hasPrimary = media => !!getPrimary(media)

// Prefer explicit mediaType on the item; fall back to derived type from mimeType/URL.
// Normalize explicit mediaType to match the canonical values in MEDIA_TYPES.
const getItemMediaType = item => {
  const raw = item?.mediaType
  if (typeof raw === 'string') {
    const upper = raw.toUpperCase()
    if (MEDIA_TYPES.includes(upper)) {
      return upper
    }
  }
  return deriveMediaType(item)
}

const mediaOfType = (media, type) => media.filter(item => getItemMediaType(item) === type)

const getPrimaryOfType = (media, type) => mediaOfType(media, type).find(isPrimary)

const hasPrimaryOfType = (media, type) => !!getPrimaryOfType(media, type)

// A media item is primary only if its explicit isPrimary flag is true.
const isPrimary = mediaItem => !!mediaItem.isPrimary

// Normalize a raw media item by attaching a canonical mediaType.
const normalizeMediaItem = item => ({
  ...item,
  mediaType: getItemMediaType(item),
})

const mediaItemEdits = ({ initial, staged }) =>
  stagedEdits({
    stateTypes: CONCEPT_STATE.MEDIA_ITEM,
    displayFields: MEDIA_DISPLAY_FIELDS,
    initial,
    staged,
  })

const mediaItemFields = mediaItem => displayItem(mediaItem, MEDIA_DISPLAY_FIELDS)

export {
  checkMediaUrlExists,
  deriveMediaType,
  getMediaType,
  getItemMediaType,
  normalizeMediaItem,
  getPrimary,
  hasPrimary,
  isPrimary,
  mediaOfType,
  getPrimaryOfType,
  hasPrimaryOfType,
  MEDIA_TYPES,
  IMAGE,
  ICON,
  VIDEO,
  mediaItemEdits,
  mediaItemFields,
}

