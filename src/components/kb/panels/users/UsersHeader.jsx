import { Box, Button } from '@mui/material'

import PanelTitle from '@/components/common/PanelTitle'

const UsersHeader = ({ onAddUser, onExportCsv, users }) => {
  return (
    <Box>
      <PanelTitle title='Users' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Button variant='contained' color='primary' onClick={onAddUser} sx={{ ml: 2 }}>
          Add User
        </Button>
        <Button
          color='primary'
          onClick={() => onExportCsv(users)}
          sx={{ mr: 2 }}
          variant='contained'
        >
          Export CSV
        </Button>
      </Box>
    </Box>
  )
}

export default UsersHeader
