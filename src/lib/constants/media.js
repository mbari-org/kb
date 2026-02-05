const MEDIA_DISPLAY_FIELDS = ['url', 'credit', 'caption', 'isPrimary']

// Ordered list of media types controls display ordering: IMAGE, ICON, VIDEO
const MEDIA_TYPES = ['IMAGE', 'ICON', 'VIDEO']

const MEDIA_EXTENSIONS = {
  IMAGE: new Set(['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'tiff', 'webp']),
  VIDEO: new Set(['mp4', 'mov', 'm4v', 'webm', 'ogg', 'ogv']),
  ICON: new Set(['ico']),
}

export { MEDIA_DISPLAY_FIELDS, MEDIA_EXTENSIONS, MEDIA_TYPES }
