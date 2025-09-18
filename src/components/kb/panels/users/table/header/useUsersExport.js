import { use } from 'react'

import { getUsers } from '@/lib/api/users'

import ConfigContext from '@/contexts/config/ConfigContext'
import UserContext from '@/contexts/user/UserContext'

import { csvHeaders, humanTimestamp, writeCSVContent } from '@/lib/utils'

const csvComments = ({ user }) => {
  var comments = '# Knowledge Base Users Export\n'
  comments += `#   Exported By: ${user.name}\n`
  comments += `#   Date: ${humanTimestamp(new Date())}\n`
  comments += '#\n'
  return comments
}

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
  const { apiFns } = use(ConfigContext)
  const { user } = use(UserContext)
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
      await writable.write(csvComments({ user }))
      await writable.write(csvHeaders(dataHeaders))
      await writeCSVContent(writable, userData(users))
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
