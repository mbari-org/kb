import { use } from 'react'

import { Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { UNSAFE_ACTION } from '@/constants/unsafeAction.js'
import { SELECTED } from '@/constants/selected.js'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import RefreshContext from '@/contexts/refresh/RefreshContext'

const ICON_SIZE = 22

const UserActions = () => {
  const { logout, user, hasUnsavedChanges, setUnsafeAction } = use(UserContext)
  const { panels } = use(SelectedContext)

  const handleLogout = () => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      setUnsafeAction({ type: UNSAFE_ACTION.LOGOUT, payload: {} })
    } else {
      logout()
    }
  }

  const loggedInUser = user.name === 'readonly' ? '' : `${user.name} |`

  const { refresh } = use(RefreshContext)

  const handleRefresh = async () => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      setUnsafeAction({ type: UNSAFE_ACTION.REFRESH, payload: {} })
    } else {
      await refresh()
    }
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
