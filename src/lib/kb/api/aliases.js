import { oniDelete, oniPost, oniPut } from '@/lib/services/oni/methods'

const createAlias = async (config, alias) => oniPost(config, ['names'], alias)

const deleteAlias = async (config, aliasName) => oniDelete(config, ['names', aliasName])

const updateAlias = async (config, [conceptName, alias]) =>
  oniPut(config, ['names', conceptName], alias)

export { createAlias, deleteAlias, updateAlias }
