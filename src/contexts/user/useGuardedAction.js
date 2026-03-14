import { use, useCallback } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { SELECTED } from '@/lib/constants/selected.js'
import { GUARDED_ACTION } from '@/lib/constants/guardedAction.js'

const useGuardedAction = () => {
  const { panels } = use(SelectedContext)
  const { hasUnsavedChanges, setGuardedAction } = use(UserContext)

  const isGuardedContext = useCallback(() => {
    const isOnConceptsPanel = panels.current() === SELECTED.PANELS.CONCEPTS
    return isOnConceptsPanel && hasUnsavedChanges
  }, [hasUnsavedChanges, panels])

  const runGuardedAction = useCallback(
    ({ onSafe, payload = {}, type }) => {
      if (isGuardedContext()) {
        setGuardedAction({ type, payload })
        return false
      }

      return onSafe()
    },
    [isGuardedContext, setGuardedAction]
  )

  const guardPanelChange = useCallback(
    ({ onSafe, panel, settings }) => {
      const payload = settings ? { panel, settings } : { panel }
      return runGuardedAction({ onSafe, payload, type: GUARDED_ACTION.CHANGE_PANEL })
    },
    [runGuardedAction]
  )

  return { guardPanelChange, runGuardedAction }
}

export default useGuardedAction
