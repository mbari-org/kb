import { oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createUser = async (config, user) => oniPost(config, ['users'], user)

const getUsers = async config => oniGet(config, ['users'])

const updateUser = async (config, [username, updatedData]) =>
  oniPut(config, ['users', username], updatedData)

export { createUser, getUsers, updateUser }
