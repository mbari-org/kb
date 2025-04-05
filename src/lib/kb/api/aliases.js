import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createAlias = async (config, alias) => oniPost(config, ['names'], alias)

const deleteAlias = async (config, aliasName) => oniDelete(config, ['names', aliasName])

const fetchAliases = async (config, conceptName) => oniGet(config, ['names', conceptName])

const updateAlias = async (config, [conceptName, alias]) =>
  oniPut(config, ['names', conceptName], alias)

export { createAlias, deleteAlias, fetchAliases, updateAlias }
