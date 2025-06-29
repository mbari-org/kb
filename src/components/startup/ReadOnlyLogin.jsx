import { use, useCallback } from 'react'

import { Box, Button } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'

import { loginReadOnly } from '@/lib/services/auth/login'

const ReadOnlyLogin = () => {
  const { processAuth } = use(UserContext)

  const handleReadOnlyLogin = useCallback(() => {
    loginReadOnly().then(({ auth }) => {
      processAuth(auth)
    })
  }, [processAuth])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: -2,
        mr: 2,
        mt: 2,
      }}
    >
      <Button
        onClick={handleReadOnlyLogin}
        sx={{
          '&:hover': {
            fontStyle: 'italic',
          },
          background: 'none',
          border: 'none',
          color: 'blue',
          cursor: 'pointer',
          fontSize: '16px',
          textDecoration: 'none',
        }}
      >
        Read Only Access
      </Button>
    </Box>
  )
}

export default ReadOnlyLogin
