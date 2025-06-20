import { use } from 'react'

import { getUsers } from '@/lib/api/users'

import ConfigContext from '@/contexts/config/ConfigContext'

import { escapeCSV, humanTimestamp, writeCSVContent } from '@/lib/utils'

const userDataHeaders = [
  'Username',
  'Role',
  'Affiliation',
  'First Name',
  'Last Name',
  'Email',
  'Last Updated',
]

const userRows = users =>
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
  const { apiFns } = use(ConfigContext)

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

      const users = await apiFns.apiPayload(getUsers)

      const writable = await handle.createWritable()
      await writable.write(userDataHeaders.map(escapeCSV).join(',') + '\n')

      await writeCSVContent(writable, userRows(users))
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
