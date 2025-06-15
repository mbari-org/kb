import { use } from 'react'
import { Box, Button, Typography } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'
import useAddUserModal from '@/components/kb/panels/users/add/useAddUserModal'
import useUsersExport from '@/components/kb/panels/users/useUsersExport'

import UsersContext from '@/contexts/users/UsersContext'

const UsersHeader = () => {
  const { addUser, users } = use(UsersContext)

  const addUserModal = useAddUserModal(addUser)
  const usersExport = useUsersExport()

  return (
    <Box>
      <PanelTitle title='Users' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography variant='body1'>Total: {users?.length || 0}</Typography>
          <Button onClick={usersExport} sx={{ ml: 2 }}>
            Export
          </Button>
        </Box>
        <Button variant='contained' color='primary' onClick={addUserModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default UsersHeader
