import { MEDIA } from '@/lib/constants'
import { FIELDS } from '@/lib/config/fields.js'
import { getMediaType, isPrimary } from '@/lib/model/media'
import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

const { ID, IS_PRIMARY, URL } = FIELDS.MEDIA

const createMediaItem = async (config, mediaItem) => oniUserPost({ config, path: ['media'], data: mediaItem })

const deleteMediaItem = async (config, mediaItemId) => oniUserDelete({ config, path: ['media', mediaItemId] })

const getMedia = async (config, conceptName) => oniGet({ config, path: ['media', 'search', 'concept', conceptName] })

const updateMediaItem = async (config, [mediaItemId, mediaItem]) =>
  oniUserPut({ config, path: ['media', mediaItemId], data: mediaItem })

const PRIMARY_PATCH_PATTERN = /_01\.[a-z0-9]+$/i

const patchPrimaryImageFlag = async (apiFns, concept) => {
  const media = concept.media
  if (media.length === 0 || media.some(isPrimary)) return

  const images = media.filter(item => getMediaType(item[URL]) === MEDIA.TYPE.IMAGE)
  const candidates = 0 < images.length ? images : media
  const primaryItem = candidates.find(item => PRIMARY_PATCH_PATTERN.test(item[URL])) ?? candidates[0]

  await apiFns.apiPayload(updateMediaItem, [primaryItem[ID], { [IS_PRIMARY]: true }])
  primaryItem[IS_PRIMARY] = true
}

export { createMediaItem, deleteMediaItem, getMedia, patchPrimaryImageFlag, updateMediaItem }
