import { use, useEffect, useState } from 'react'

import AuthContext from '@/contexts/auth/AuthContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import UsersContext from '@/contexts/users/UsersContext'

import { isAdmin } from '@/lib/auth/role'

import { fetchUsers, createUser, deleteUser as removeUser, updateUser } from '@/lib/kb/api/users'

import { drop } from '@/lib/util'

const UsersProvider = ({ children }) => {
  const { user } = use(AuthContext)
  const { apiFns, config } = use(ConfigContext)

  const [users, setUsers] = useState([])

  useEffect(() => {
    console.log('UsersProvider effect - state:', { user, config, apiFns })
    if (!user) return
    if (!config?.valid) return
    if (!apiFns) return

    const loadUsers = async () => {
      try {
        const fetchedUsers = await apiFns.apiPayload(fetchUsers)
        setUsers(fetchedUsers.map(user => drop(user, ['password'])))
      } catch (error) {
        console.error('Error loading users:', error)
      }
    }
    if (isAdmin(user)) loadUsers()
  }, [apiFns, config, user])

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

  return (
    <UsersContext.Provider value={{ users, addUser, deleteUser, editUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
