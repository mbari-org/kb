import { useContext } from 'react'

import { Box } from '@mui/material'

import UsersContext from '@/contexts/users/UsersContext'

import UsersHeader from '@/components/kb/panels/users/UsersHeader'
import UserTable from '@/components/kb/panels/users/UsersTable'

import useAddUser from '@/components/kb/panels/users/add/useAddUser'
import useExportUsers from '@/components/kb/panels/users/useExportUsers'

const Users = () => {
  const { users } = useContext(UsersContext)

  const addUser = useAddUser()
  const { exportToCsv } = useExportUsers()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <UsersHeader onAddUser={addUser} onExportCsv={exportToCsv} users={users} />
      <UserTable users={users} />
    </Box>
  )
}

export default Users
