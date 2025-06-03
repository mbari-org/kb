import { getUsers } from '@/lib/kb/api/users'

const userDataHeaders = ['Username', 'Role', 'Affiliation', 'First Name', 'Last Name', 'Email']

const usersExport = async ({ apiFns }) => {
  try {
    const users = await apiFns.apiPayload(getUsers)

    const csvRows = users.map(user => [
      user.username,
      user.role,
      user.affiliation,
      user.firstName,
      user.lastName,
      user.email,
    ])

    const csvContent = [userDataHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n')

    // Create a File object
    const file = new File([csvContent], 'KB-Users.csv', { type: 'text/csv' })

    try {
      // Request a file handle
      const handle = await window.showSaveFilePicker({
        suggestedName: 'KB-Users.csv',
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      // Create a FileSystemWritableFileStream to write to
      const writable = await handle.createWritable()
      // Write the contents
      await writable.write(file)
      // Close the file and write the contents to disk
      await writable.close()
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error saving file:', err)
      }
    }
  } catch (error) {
    console.error('Error exporting users:', error)
  }
}

export default usersExport
