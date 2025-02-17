import { use } from 'react'

import { Button, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import AuthContext from '@/contexts/auth/AuthContext'

const LogoutLink = () => {
  const { logout, user } = use(AuthContext)

  return (
    <Stack
      alignItems='flex-end'
      spacing={0.25}
      justifyContent='center'
      height='50px'
      padding={0}
      sx={{ padding: 0, margin: 0, marginTop: '-15px' }}
    >
      <Typography
        variant='caption'
        style={{
          fontSize: '0.75rem',
          textAlign: 'right',
          paddingRight: '4px',
          color: grey[400],
        }}
      >
        {user.name} ({user.role})
      </Typography>
      <Button
        color='inherit'
        size='small'
        onClick={logout}
        sx={{
          padding: 0,
          margin: 0,
          fontSize: '0.875rem',
          '&:hover': {
            fontStyle: 'italic',
          },
        }}
      >
        Logout
      </Button>
    </Stack>
  )
}

export default LogoutLink
