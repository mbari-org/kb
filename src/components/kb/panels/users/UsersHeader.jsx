import { Typography, Button, Box } from '@mui/material'

const UsersHeader = ({ onAddUser, onExportCsv, users }) => {
  return (
    <Box>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h4'>
        Users
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Button variant='contained' color='primary' onClick={onAddUser} sx={{ ml: 2 }}>
          Add User
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => onExportCsv(users)}
          sx={{ mr: 2 }}
        >
          Export CSV
        </Button>
      </Box>
    </Box>
  )
}

export default UsersHeader
