import { getUsers } from '@/lib/kb/api/users'

const userDataHeaders = ['Username', 'Role', 'Affiliation', 'First Name', 'Last Name', 'Email']

const usersExport = ({ apiFns }) => {
  apiFns
    .apiPayload(getUsers)
    .then(users => {
      const csvRows = users.map(user => [
        user.username,
        user.role,
        user.affiliation,
        user.firstName,
        user.lastName,
        user.email,
      ])

      const csvContent = [userDataHeaders.join(','), ...csvRows.map(row => row.join(','))].join(
        '\n'
      )

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'KB-Users.csv'
      link.click()
    })
    .catch(error => {
      console.error('Error exporting users:', error)
    })
}

export default usersExport
