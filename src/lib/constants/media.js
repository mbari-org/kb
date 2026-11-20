import { FIELDS } from '@/lib/config/fields.js'

const { CAPTION, CREDIT, IS_PRIMARY, URL } = FIELDS.MEDIA

const MEDIA = {
  TYPE: {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    ICON: 'ICON',
  },
  EXTENSIONS: {
    IMAGE: new Set(['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'tiff', 'webp']),
    VIDEO: new Set(['mp4', 'mov', 'm4v', 'webm', 'ogg', 'ogv']),
    ICON: new Set(['ico']),
  },
  DISPLAY: [URL, CREDIT, CAPTION, IS_PRIMARY],
}

MEDIA.ORDER = [MEDIA.TYPE.IMAGE, MEDIA.TYPE.VIDEO, MEDIA.TYPE.ICON]

export { MEDIA }
