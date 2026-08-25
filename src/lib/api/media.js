import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

const createMediaItem = async (config, mediaItem) => oniUserPost({ config, path: ['media'], data: mediaItem })

const deleteMediaItem = async (config, mediaItemId) => oniUserDelete({ config, path: ['media', mediaItemId] })

const getMedia = async (config, conceptName) => oniGet({ config, path: ['media', 'search', 'concept', conceptName] })

const updateMediaItem = async (config, [mediaItemId, mediaItem]) =>
  oniUserPut({ config, path: ['media', mediaItemId], data: mediaItem })

export { createMediaItem, deleteMediaItem, getMedia, updateMediaItem }
