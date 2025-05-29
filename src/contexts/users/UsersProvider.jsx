import { use, useEffect, useState } from 'react'

import AuthContext from '@/contexts/auth/AuthContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import UsersContext from '@/contexts/users/UsersContext'

import { isAdmin } from '@/lib/auth/role'

import { getUsers, createUser, deleteUser as removeUser, updateUser } from '@/lib/kb/api/users'

import { drop } from '@/lib/util'

const UsersProvider = ({ children }) => {
  const { user } = use(AuthContext)
  const { apiFns, config } = use(ConfigContext)

  const [users, setUsers] = useState([])

  const addUser = async newUser => {
    try {
      const createdUser = await apiFns.apiPayload(createUser, newUser)
      setUsers(prevUsers => {
        const newUsers = [...prevUsers, createdUser]
        return newUsers
      })
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const editUser = async (username, updatedData) => {
    try {
      const updatedUser = await apiFns.apiPayload(updateUser, [username, updatedData])
      setUsers(prevUsers =>
        prevUsers.map(user => (user.username === username ? updatedUser : user))
      )
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async username => {
    try {
      await apiFns.apiPayload(removeUser, username)
      setUsers(prevUsers => prevUsers.filter(user => user.username !== username))
    } catch (error) {
      console.error('Error removing user:', error)
    }
  }

  useEffect(() => {
    if (!config?.valid || !user) return

    const loadUsers = async () => {
      const { error, payload: users } = await getUsers(config)
      if (error) throw error
      setUsers(users.map(user => drop(user, ['password'])))
    }
    if (isAdmin(user)) loadUsers()
  }, [config, user])

  return (
    <UsersContext.Provider value={{ users, addUser, deleteUser, editUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
