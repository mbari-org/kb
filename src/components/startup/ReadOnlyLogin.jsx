import { use, useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'

import { loginReadOnly } from '@/lib/services/auth/login'

const ReadOnlyLogin = ({ isVisible = true }) => {
  const [asyncError, setAsyncError] = useState(null)
  const { processAuth } = use(UserContext)

  const handleReadOnlyLogin = useCallback(async () => {
    try {
      const { auth } = await loginReadOnly()
      const result = await processAuth(auth)
      if (result?.error) throw result.error
    } catch (error) {
      setAsyncError(error)
    }
  }, [processAuth])

  if (!isVisible) {
    return null
  }

  if (asyncError) {
    throw asyncError
  }

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
