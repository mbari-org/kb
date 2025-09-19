import { use } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
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

const dataRows = users =>
  users.map(user => [
    user.username,
    user.role,
    user.affiliation,
    user.firstName,
    user.lastName,
    user.email,
    humanTimestamp(user.lastUpdated),
  ])

const buildComments = () => {
  return []
}

const suggestName = () => 'KB-Users.csv'

const useUsersExport = () => {
  const { users } = use(UsersContext)
  const { user } = use(UserContext)
  const { setExporting } = use(PanelDataContext)

  return csvExport({
    comments: buildComments(),
    count: users.length,
    getData: async () => dataRows(users),
    headers: dataHeaders,
    onProgress: setExporting,
    paginated: false,
    suggestName,
    title: 'Knowledge Base Users',
    user,
  })
}
export default useUsersExport
