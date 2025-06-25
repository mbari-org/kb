import { use } from 'react'

import { Button, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'

import { LABELS } from '@/lib/constants'

import { hasModifiedState } from '@/lib/kb/state/concept'

const { SAVE } = LABELS.BUTTON

const LogoutLink = () => {
  const { logout, user } = use(UserContext)
  const { initialState, stagedState } = use(ConceptContext)

  const displayStaged = useDisplayStaged()

  const handleLogout = () =>
    hasModifiedState({ initialState, stagedState }) ? displayStaged(SAVE) : logout()

  const loggedInUser = user.name === 'readonly' ? '' : `${user.name} |`

  return (
    <Stack
      alignItems='flex-end'
      height='50px'
      justifyContent='center'
      padding={0}
      sx={{ padding: 0, mt: -3 }}
    >
      <Typography
        sx={{
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
          padding: 0,
        }}
      >
        Logout
      </Button>
    </Stack>
  )
}

export default LogoutLink
