import { oniDelete, oniPost, oniPut } from '@/lib/services/oni/methods'

const createAlias = async (config, alias) => oniPost({ config, path: ['names'], data: alias })

const deleteAlias = async (config, aliasName) => oniDelete({ config, path: ['names', aliasName] })

const updateAlias = async (config, [conceptName, alias]) =>
  oniPut({ config, path: ['names', conceptName], data: alias })

export { createAlias, deleteAlias, updateAlias }
