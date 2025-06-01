import { use } from 'react'
import { Box, Button, Typography } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'
import useAddUserModal from '@/components/kb/panels/users/add/useAddUserModal'

import UsersContext from '@/contexts/users/UsersContext'

const UsersHeader = () => {
  const { addUser, users } = use(UsersContext)

  const addUserModal = useAddUserModal(addUser)

  return (
    <Box>
      <PanelTitle title='Users' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Typography variant='body1' sx={{ ml: 2 }}>
          Total: {users?.length || 0}
        </Typography>
        <Button variant='contained' color='primary' onClick={addUserModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default UsersHeader
