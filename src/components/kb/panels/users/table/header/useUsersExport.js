import { use, useCallback, useState } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import UsersContext from '@/contexts/panels/users/UsersContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'

import CONFIG from '@/text'
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
  const { beginProcessing } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

  const onProgress = useCallback(
    value => {
      if (value === false) {
        if (processingStop) {
          processingStop()
          setProcessingStop(null)
        }
      } else if (typeof value === 'string') {
        if (!processingStop) {
          setProcessingStop(() => beginProcessing(PROCESSING.LOAD, value))
        } else if (processingStop.updateMessage) {
          processingStop.updateMessage(value)
        }
      }
    },
    [processingStop, beginProcessing]
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
