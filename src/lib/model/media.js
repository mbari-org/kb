import { displayItem, stagedEdits } from '@/lib/concept/state/staged'
import { MEDIA_DISPLAY_FIELDS, MEDIA_EXTENSIONS, MEDIA_TYPES } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const [IMAGE, ICON, VIDEO] = MEDIA_TYPES

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

const mediaOfType = (media, type) => media.filter(item => getMediaType(item.url) === type)

const getPrimaryOfType = (media, type) => mediaOfType(media, type).find(isPrimary)

const hasPrimaryOfType = (media, type) => !!getPrimaryOfType(media, type)

const isPrimary = mediaItem => mediaItem.isPrimary || /.*_01\..*/.test(mediaItem.url)

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
  getMediaType,
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

