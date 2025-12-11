import { use, useCallback } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import CONFIG from '@/config'
import { humanTimestamp } from '@/lib/utils'

const { PROCESSING } = CONFIG

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
  const { setProcessing } = use(AppModalContext)

  const onProgress = useCallback(
    value => {
      if (value === false) {
        setProcessing(PROCESSING.OFF)
      } else if (typeof value === 'string') {
        setProcessing(PROCESSING.LOAD, value)
      }
    },
    [setProcessing]
  )

  return csvExport({
    comments: buildComments(),
    count: users.length,
    getData: async () => dataRows(users),
    headers: dataHeaders,
    onProgress,
    paginated: false,
    suggestName,
    title: 'Knowledge Base Users',
    user,
  })
}
export default useUsersExport
