import { Box, Button, Typography } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'

const UsersHeader = ({ onAddUser, users }) => {
  return (
    <Box>
      <PanelTitle title='Users' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Typography variant='body1' sx={{ ml: 2 }}>
          Total: {users?.length || 0}
        </Typography>
        <Button variant='contained' color='primary' onClick={onAddUser} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default UsersHeader
