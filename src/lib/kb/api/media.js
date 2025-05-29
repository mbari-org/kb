import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createMediaItem = async (config, mediaItem) => oniPost(config, ['media'], mediaItem)

const deleteMediaItem = async (config, mediaItemId) => oniDelete(config, ['media', mediaItemId])

const getMedia = async (config, conceptName) => oniGet(config, ['media', conceptName])

const updateMediaItem = async (config, [mediaItemId, mediaItem]) =>
  oniPut(config, ['media', mediaItemId], mediaItem)

export { createMediaItem, deleteMediaItem, getMedia, updateMediaItem }
