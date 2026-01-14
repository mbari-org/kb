import { use } from 'react'

import { Stack } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { UNSAFE_ACTION } from '@/lib/constants/unsafeAction.js'
import { SELECTED } from '@/lib/constants/selected.js'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import InfoIcon from '@/components/icon/InfoIcon'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import useAppInfoTooltip from '@/lib/hooks/useAppInfoTooltip'

const ICON_SIZE = 22

const UserActions = () => {
  const { logout, hasUnsavedChanges, setUnsafeAction } = use(UserContext)
  const { panels } = use(SelectedContext)
  const appInfoTooltip = useAppInfoTooltip()

  const handleLogout = () => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    const hasModifications = isOnConceptsPanel && hasUnsavedChanges

    if (hasModifications) {
      setUnsafeAction({ type: UNSAFE_ACTION.LOGOUT, payload: {} })
    } else {
      logout()
    }
  }

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
      alignItems='center'
      direction='row'
      spacing={1}
      sx={{ mt: -1.5 }}
    >
      <InfoIcon size={ICON_SIZE} tooltip={appInfoTooltip} />
      <RefreshAppIcon onClick={handleRefresh} size={ICON_SIZE} tooltip='Refresh Data' />
      <LogoutIcon onClick={handleLogout} size={ICON_SIZE} tooltip='Logout' />
    </Stack>
  )
}

export default UserActions
