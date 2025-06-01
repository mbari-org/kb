import { Box } from '@mui/material'

import UsersHeader from '@/components/kb/panels/users/UsersHeader'
import UserTable from '@/components/kb/panels/users/UsersTable'
import UsersProvider from '@/contexts/users/UsersProvider'

const Users = () => {
  return (
    <UsersProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <UsersHeader />
        <UserTable />
      </Box>
    </UsersProvider>
  )
}

export default Users
