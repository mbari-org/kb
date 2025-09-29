import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createMediaItem = async (config, mediaItem) => oniPost({ config, path: ['media'], data: mediaItem })

const deleteMediaItem = async (config, mediaItemId) => oniDelete({ config, path: ['media', mediaItemId] })

const getMedia = async (config, conceptName) => oniGet({ config, path: ['media', conceptName] })

const updateMediaItem = async (config, [mediaItemId, mediaItem]) =>
  oniPut({ config, path: ['media', mediaItemId], data: mediaItem })

export { createMediaItem, deleteMediaItem, getMedia, updateMediaItem }
