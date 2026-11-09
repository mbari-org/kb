import { MEDIA } from '@/lib/constants'
import { getMediaType, isPrimary } from '@/lib/model/media'
import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

const createMediaItem = async (config, mediaItem) => oniUserPost({ config, path: ['media'], data: mediaItem })

const deleteMediaItem = async (config, mediaItemId) => oniUserDelete({ config, path: ['media', mediaItemId] })

const getMedia = async (config, conceptName) => oniGet({ config, path: ['media', 'search', 'concept', conceptName] })

const updateMediaItem = async (config, [mediaItemId, mediaItem]) =>
  oniUserPut({ config, path: ['media', mediaItemId], data: mediaItem })

const PRIMARY_PATCH_PATTERN = /_01\.[a-z0-9]+$/i

// Legacy data can leave a concept's media with no primary flagged. Patch by promoting the
//  "_01" image (or any image when there is no "_01"), both locally and on the server.
const patchPrimaryImageFlag = async (apiFns, concept) => {
  const media = concept.media
  if (media.length === 0 || media.some(isPrimary)) return

  const images = media.filter(item => getMediaType(item.url) === MEDIA.TYPE.IMAGE)
  const candidates = 0 < images.length ? images : media
  const primaryItem = candidates.find(item => PRIMARY_PATCH_PATTERN.test(item.url)) ?? candidates[0]

  await apiFns.apiPayload(updateMediaItem, [primaryItem.id, { isPrimary: true }])
  primaryItem.isPrimary = true
}

export { createMediaItem, deleteMediaItem, getMedia, patchPrimaryImageFlag, updateMediaItem }
