import { use, useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'

import { loginReadOnly } from '@/lib/services/auth/login'

const ReadOnlyLogin = () => {
  const [asyncError, setAsyncError] = useState(null)
  const { processAuth } = use(UserContext)
  if (asyncError) {
    throw asyncError
  }

  const handleReadOnlyLogin = useCallback(async () => {
    try {
      const { auth } = await loginReadOnly()
      processAuth(auth)
    } catch (error) {
      setAsyncError(error)
    }
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
