import { oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

const createAlias = async (config, alias) => oniUserPost({ config, path: ['names'], data: alias })

const deleteAlias = async (config, aliasName) => oniUserDelete({ config, path: ['names', aliasName] })

const updateAlias = async (config, [conceptName, alias]) =>
  oniUserPut({ config, path: ['names', conceptName], data: alias })

export { createAlias, deleteAlias, updateAlias }
