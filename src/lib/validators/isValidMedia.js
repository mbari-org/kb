import { getMediaType } from '@/lib/model/media'
import { MEDIA } from '@/lib/constants'

const { IMAGE, VIDEO, ICON } = MEDIA.TYPE

const checkImageUrlExists = url =>
  new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })

const checkVideoUrlExists = url =>
  new Promise(resolve => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => resolve(true)
    video.onerror = () => resolve(false)
    video.src = url
  })

const isValidMedia = async url => {
  const mediaType = getMediaType(url)

  switch (mediaType) {
    case IMAGE:
    case ICON:
      return checkImageUrlExists(url)
    case VIDEO:
      return checkVideoUrlExists(url)
    default: {
      const isImage = await checkImageUrlExists(url)
      if (isImage) return true
      return checkVideoUrlExists(url)
    }
  }
}

export default isValidMedia
