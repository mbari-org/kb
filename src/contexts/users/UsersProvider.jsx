import { use, useEffect, useState } from 'react'

import AuthContext from '@/contexts/auth/AuthContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import UsersContext from '@/contexts/users/UsersContext'

import { isAdmin } from '@/lib/auth/role'

import { getUsers, createUser, updateUser } from '@/lib/kb/api/users'

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

  const lockUser = async (username, lock) => {
    try {
      // CxTmp until locked is implemented in the backend
      // await apiFns.apiPayload(updateUser, [username, { locked: lock }])
      setUsers(prevUsers =>
        prevUsers.map(user => (user.username === username ? { ...user, locked: lock } : user))
      )
    } catch (error) {
      console.error('Error locking user:', error)
    }
  }

  useEffect(() => {
    if (!config?.valid || !user) return

    const loadUsers = async () => {
      const { error, payload: users } = await getUsers(config)
      if (error) throw error
      // CxTmp until locked is implemented in the backend
      const cxTmpUsers = users.map(user => ({ ...user, locked: false }))
      setUsers(cxTmpUsers.map(user => drop(user, ['password'])))
    }
    if (isAdmin(user)) loadUsers()
  }, [config, user])

  return (
    <UsersContext.Provider value={{ users, addUser, editUser, lockUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
