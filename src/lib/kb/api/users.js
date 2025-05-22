import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createUser = async (config, user) => oniPost(config, ['users'], user)

const deleteUser = async (config, userId) => oniDelete(config, ['users', userId])

const fetchUsers = async config => oniGet(config, ['users'])

const updateUser = async (config, [userId, user]) => oniPut(config, ['users', userId], user)

export { createUser, deleteUser, fetchUsers, updateUser }
