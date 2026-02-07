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
  DISPLAY: ['url', 'credit', 'caption', 'isPrimary'],
}

MEDIA.ORDER = [MEDIA.TYPE.IMAGE, MEDIA.TYPE.VIDEO, MEDIA.TYPE.ICON]

export { MEDIA }
