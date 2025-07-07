import { use } from 'react'

import { Button, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useStagedModal from '@/components/kb/panels/concepts/concept/change/staged/modal/useStagedModal'

import { LABELS, SELECTED } from '@/lib/constants'

const { SAVE } = LABELS.BUTTON

const LogoutLink = () => {
  const { logout, user, hasUnsavedChanges } = use(UserContext)
  const { panels } = use(SelectedContext)
  const { setModalData } = use(ConceptModalContext)

  const displayStaged = useStagedModal()

  const handleLogout = () => {
    // Only check for unsaved data if we're currently on the concepts panel
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      displayStaged(SAVE)
      setModalData(prev => ({ ...prev, logout: true }))
    } else {
      logout()
    }
  }

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
