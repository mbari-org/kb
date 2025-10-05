import { use } from 'react'

import { Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED, UNSAFE_ACTION } from '@/lib/constants'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import RefreshContext from '@/contexts/refresh/RefreshContext'

const ICON_SIZE = 22

const UserActions = () => {
  const { logout, user, hasUnsavedChanges, setUnsafeAction, updatePreferences } = use(UserContext)
  const { panels, concepts, getSettings } = use(SelectedContext)

  const savePrefsThen = async next => {
    try {
      const prefs = {
        concepts: { state: concepts.getState(), position: concepts.getPosition() },
        panels: { state: panels.getState(), position: panels.getPosition() },
        settings: {
          history: getSettings('history'),
          references: getSettings('references'),
          templates: getSettings('templates'),
        },
      }
      await updatePreferences(prefs)
    } catch (error) {
      console.error('Failed to save preferences on logout:', error)
    }
    next()
  }

  const handleLogout = () => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      setUnsafeAction({ type: UNSAFE_ACTION.LOGOUT, payload: {} })
    } else {
      savePrefsThen(logout)
    }
  }

  const loggedInUser = user.name === 'readonly' ? '' : `${user.name} |`

  const { refresh } = use(RefreshContext)

  const handleRefresh = () => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      setUnsafeAction({ type: UNSAFE_ACTION.REFRESH, payload: {} })
    } else {
      savePrefsThen(refresh)
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
