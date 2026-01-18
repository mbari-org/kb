import { use } from 'react'

import { Stack } from '@mui/material'

import createAppModal from '@/components/modal/app/createAppModal'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import AppModalContext from '@/contexts/app/AppModalContext'

import { UNSAFE_ACTION } from '@/lib/constants/unsafeAction.js'
import { SELECTED } from '@/lib/constants/selected.js'
import LogoutIcon from '@/components/icon/LogoutIcon'
import RefreshAppIcon from '@/components/icon/RefreshAppIcon'
import InfoIcon from '@/components/icon/InfoIcon'
import AppInfoContent from '@/components/kb/nav/AppInfoContent'
import AppInfoTitle from '@/components/kb/nav/AppInfoTitle'
import RefreshContext from '@/contexts/refresh/RefreshContext'

const ICON_SIZE = 22

const UserActions = () => {
  const { logout, hasUnsavedChanges, setUnsafeAction } = use(UserContext)
  const { panels } = use(SelectedContext)
  const { setModal } = use(AppModalContext)

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

  const handleAppInfo = () => {
    const modal = createAppModal({
      Content: AppInfoContent,
      Title: AppInfoTitle,
      minWidth: 520,
      focusClose: true,
    })
    setModal(modal)
  }

  return (
    <Stack
      alignItems='center'
      direction='row'
      spacing={1}
      sx={{ mt: -1.5 }}
    >
      <InfoIcon onClick={handleAppInfo} size={ICON_SIZE} tooltip='App Info' />
      <RefreshAppIcon onClick={handleRefresh} size={ICON_SIZE} tooltip='Refresh Data' />
      <LogoutIcon onClick={handleLogout} size={ICON_SIZE} tooltip='Logout' />
    </Stack>
  )
}

export default UserActions
