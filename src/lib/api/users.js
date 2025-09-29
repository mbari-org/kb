import { oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createUser = async (config, user) => oniPost({ config, path: ['users'], data: user })

const getUsers = async config => oniGet({ config, path: ['users'] })

const updateUser = async (config, [username, updatedData]) =>
  oniPut({ config, path: ['users', username], data: updatedData })

export { createUser, getUsers, updateUser }
