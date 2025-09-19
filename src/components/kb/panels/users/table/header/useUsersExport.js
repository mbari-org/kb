import { use } from 'react'

import UsersContext from '@/contexts/panels/users/UsersContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import { humanTimestamp } from '@/lib/utils'

const dataHeaders = [
  'Username',
  'Role',
  'Affiliation',
  'First Name',
  'Last Name',
  'Email',
  'Last Updated',
]

const userData = users =>
  users.map(user => [
    user.username,
    user.role,
    user.affiliation,
    user.firstName,
    user.lastName,
    user.email,
    humanTimestamp(user.lastUpdated),
  ])

const useUsersExport = () => {
  const { users } = use(UsersContext)
  const { user } = use(UserContext)

  const getUsersData = async () => userData(users)

  const usersExport = csvExport({
    count: users.length,
    getData: getUsersData,
    headers: dataHeaders,
    suggestedName: () => 'KB-Users.csv',
    title: 'Knowledge Base Users',
    user,
  })

  return usersExport
}
export default useUsersExport
