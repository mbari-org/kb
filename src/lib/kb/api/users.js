import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createUser = async (config, user) => oniPost(config, ['users'], user)

const deleteUser = async (config, userId) => oniDelete(config, ['users', userId])

const fetchUsers = async config => oniGet(config, ['users'])

const updateUser = async (config, [username, updatedData]) =>
  oniPut(config, ['users', username], updatedData)

export { createUser, deleteUser, fetchUsers, updateUser }
