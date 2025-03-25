import { use } from 'react'

import { Button, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

import { hasModifiedState } from '@/lib/kb/concept/state/conceptState'

const { SAVE } = LABELS.ACTION

const LogoutLink = () => {
  const { logout, user } = use(AuthContext)
  const { initialState, stagedState } = use(ConceptContext)

  const stagedStateDisplay = useStagedStateDisplay()

  const handleLogout = () =>
    hasModifiedState({ initialState, stagedState }) ? stagedStateDisplay(SAVE) : logout()

  const loggedInUser = user.name === 'readonly' ? '' : `${user.name} |`

  return (
    <Stack
      alignItems='flex-end'
      height='50px'
      justifyContent='center'
      padding={0}
      sx={{ padding: 0, margin: 0, mt: '-15px' }}
    >
      <Typography
        style={{
          color: grey[300],
          fontSize: '0.75rem',
          paddingRight: '3px',
          mt: 1,
          textAlign: 'right',
        }}
        variant='caption'
      >
        {loggedInUser} {user.role}
      </Typography>
      <Button
        color='inherit'
        size='small'
        onClick={handleLogout}
        sx={{
          '&:hover': {
            fontStyle: 'italic',
          },
          fontSize: '0.875rem',
          // margin: 0,
          padding: 0,
        }}
      >
        Logout
      </Button>
    </Stack>
  )
}

export default LogoutLink
