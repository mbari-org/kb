const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

// Ordered list of media types controls display ordering: IMAGE, ICON, VIDEO
const MEDIA_TYPES = ['IMAGE', 'ICON', 'VIDEO']

const MEDIA_EXTENSIONS = {
  IMAGE: new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'avif', 'tiff']),
  VIDEO: new Set(['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v']),
  ICON: new Set(['ico', 'icns', 'cur']),
}

export { MEDIA_DISPLAY_FIELDS, MEDIA_EXTENSIONS, MEDIA_TYPES }
