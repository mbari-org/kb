const useExportUsers = () => {
  const exportToCsv = users => {
    const headers = ['Username', 'Role', 'Affiliation', 'First Name', 'Last Name', 'Email']

    const csvRows = users.map(user => [
      user.username,
      user.role,
      user.affiliation,
      user.firstName,
      user.lastName,
      user.email,
    ])

    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'KB-Users.csv'
    link.click()
  }

  return { exportToCsv }
}

export default useExportUsers
