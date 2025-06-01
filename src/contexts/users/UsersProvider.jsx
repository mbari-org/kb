import { use, useCallback, useEffect, useState } from 'react'

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

  const addUser = useCallback(
    async newUser => {
      try {
        const createdUser = await apiFns.apiPayload(createUser, newUser)
        setUsers(prevUsers => {
          const newUsers = [...prevUsers, createdUser]
          return newUsers.sort((a, b) => a.username.localeCompare(b.username))
        })
      } catch (error) {
        console.error('Error adding user:', error)
      }
    },
    [apiFns]
  )

  const editUser = useCallback(
    async (username, updatedData) => {
      try {
        const updatedUser = await apiFns.apiPayload(updateUser, [username, updatedData])
        setUsers(prevUsers =>
          prevUsers
            .map(user => (user.username === username ? updatedUser : user))
            .sort((a, b) => a.username.localeCompare(b.username))
        )
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },
    [apiFns]
  )

  const lockUser = useCallback(async (username, lock) => {
    try {
      // CxTmp until locked is implemented in the backend
      // await apiFns.apiPayload(updateUser, [username, { locked: lock }])
      setUsers(prevUsers =>
        prevUsers.map(user => (user.username === username ? { ...user, locked: lock } : user))
      )
    } catch (error) {
      console.error('Error locking user:', error)
    }
  }, [])

  useEffect(() => {
    if (!config?.valid || !user) return

    const loadUsers = async () => {
      const { error, payload: users } = await getUsers(config)
      if (error) throw error
      // CxTmp until locked is implemented in the backend
      const cxTmpUsers = users.map(user => ({ ...user, locked: false }))
      setUsers(
        cxTmpUsers
          .map(user => drop(user, ['password']))
          .sort((a, b) => a.username.localeCompare(b.username))
      )
    }
    if (isAdmin(user)) loadUsers()
  }, [config, user])

  const value = {
    addUser,
    editUser,
    lockUser,
    users,
  }

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

export default UsersProvider
