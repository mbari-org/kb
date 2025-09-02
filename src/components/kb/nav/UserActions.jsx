import { use } from 'react'

import { Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'

import { LABELS, SELECTED } from '@/lib/constants'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import RefreshContext from '@/contexts/refresh/RefreshContext'

const { CONTINUE } = LABELS.BUTTON

const ICON_SIZE = 22

const UserActions = () => {
  const { logout, user, hasUnsavedChanges } = use(UserContext)
  const { panels } = use(SelectedContext)
  const { setModalData } = use(ConceptModalContext)

  const displayStaged = useDisplayStaged()

  const handleLogout = () => {
    // Only check for unsaved data if we're currently on the concepts panel
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      displayStaged(CONTINUE)
      setModalData(prev => ({ ...prev, logout: true }))
    } else {
      logout()
    }
  }

  const loggedInUser = user.name === 'readonly' ? '' : `${user.name} |`

  const { refresh } = use(RefreshContext)

  const handleRefresh = () => {
    refresh()
  }

  return (
    <Stack
      alignItems='flex-end'
      height='50px'
      justifyContent='center'
      padding={0}
      spacing={-0.5}
      sx={{ padding: 0, mt: -2 }}
    >
      <Typography
        sx={{
          color: grey[300],
          fontSize: '0.75rem',
          textAlign: 'right',
        }}
        variant='caption'
      >
        {loggedInUser} {user.role}
      </Typography>
      <Stack alignItems='center' direction='row' spacing={2}>
        <RefreshAppIcon onClick={handleRefresh} size={ICON_SIZE} tooltip='Refresh Data' />
        <LogoutIcon onClick={handleLogout} size={ICON_SIZE} tooltip='Logout' />
      </Stack>
    </Stack>
  )
}

export default UserActions
