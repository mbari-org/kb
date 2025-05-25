const useExportUsers = () => {
  const exportToCsv = users => {
    // Remove the actions column and prepare headers
    const headers = ['Username', 'Role', 'Affiliation', 'First Name', 'Last Name', 'Email']

    // Convert users data to CSV rows
    const csvRows = users.map(user => [
      user.username,
      user.role,
      user.affiliation,
      user.firstName,
      user.lastName,
      user.email,
    ])

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'KB-Users.csv'
    link.click()
  }

  return { exportToCsv }
}

export default useExportUsers
