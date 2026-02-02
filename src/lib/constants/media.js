const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

const MEDIA_TYPES = {
  ICON: 'ICON',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
}

const MEDIA_EXTENSIONS = {
  [MEDIA_TYPES.IMAGE]: new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'avif', 'tiff']),
  [MEDIA_TYPES.VIDEO]: new Set(['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v']),
  [MEDIA_TYPES.ICON]: new Set(['ico', 'icns', 'cur']),
}

export { MEDIA_DISPLAY_FIELDS, MEDIA_EXTENSIONS, MEDIA_TYPES }
