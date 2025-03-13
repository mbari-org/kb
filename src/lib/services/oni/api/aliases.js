import { oniDelete, oniGet, oniPost, oniPut } from './util'

const createAlias = async (config, alias) => oniPost(config, ['names'], alias)

const deleteAlias = async (config, aliasName) => oniDelete(config, ['names', aliasName])

const fetchAliases = async (config, conceptName) => oniGet(config, ['names', conceptName])

const updateAlias = async (config, [aliasName, alias]) =>
  oniPut(config, ['names', aliasName], alias)

export { createAlias, deleteAlias, fetchAliases, updateAlias }
