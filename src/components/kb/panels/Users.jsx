import { Box } from '@mui/material'

import UsersHeader from '@/components/kb/panels/users/UsersHeader'
import UserTable from '@/components/kb/panels/users/UsersTable'

const Users = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <UsersHeader />
      <UserTable />
    </Box>
  )
}

export default Users
