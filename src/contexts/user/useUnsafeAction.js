import { use, useCallback } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { SELECTED } from '@/lib/constants/selected.js'
import { UNSAFE_ACTION } from '@/lib/constants/unsafeAction.js'

const useUnsafeAction = () => {
  const { panels } = use(SelectedContext)
  const { hasUnsavedChanges, setUnsafeAction } = use(UserContext)

  const isUnsafeContext = useCallback(() => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    return isOnConceptsPanel && hasUnsavedChanges
  }, [hasUnsavedChanges, panels])

  const guardUnsafeAction = useCallback(
    ({ onSafe, payload = {}, type }) => {
      if (isUnsafeContext()) {
        setUnsafeAction({ type, payload })
        return false
      }

      return onSafe()
    },
    [isUnsafeContext, setUnsafeAction]
  )

  const guardPanelChange = useCallback(
    ({ onSafe, panel, settings }) => {
      const payload = settings ? { panel, settings } : { panel }
      return guardUnsafeAction({ onSafe, payload, type: UNSAFE_ACTION.CHANGE_PANEL })
    },
    [guardUnsafeAction]
  )

  return { guardPanelChange, guardUnsafeAction }
}

export default useUnsafeAction
