import { use } from 'react'

import UsersContext from '@/contexts/panels/users/UsersContext'

import useCsvComments from '@/hooks/useCsvComments'

import { csvHeaders, csvOut } from '@/lib/csv'
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

  const csvComments = useCsvComments({
    count: users.length,
    title: 'Knowledge Base Users',
  })

  const usersExport = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'KB-Users.csv',
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      const writable = await handle.createWritable()
      await writable.write(csvComments())
      await writable.write(csvHeaders(dataHeaders))
      await csvOut(writable, userData(users))
      await writable.close()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error saving file:', error)
      }
    }
  }

  return usersExport
}

export default useUsersExport
