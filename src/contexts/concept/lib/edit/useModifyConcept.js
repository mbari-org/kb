import { useCallback, useState } from 'react'

import { isResetAction, resetConceptState } from '@/contexts/concept/lib/edit/resetConceptState'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import useWhyUpdate from '@/components/hooks/useWhyUpdate'

const useModifyConcept = (dispatch, initialState, setConfirmReset) => {
  const [confirmAction, setConfirmAction] = useState(null)

  useWhyUpdate('useModifyConcept', { dispatch, initialState, setConfirmReset })

  return useCallback(
    action => {
      if (action.type === CONCEPT_STATE.RESET.CONFIRMED.NO) {
        setConfirmAction(null)
        setConfirmReset(false)
        return
      }

      if (action.type === CONCEPT_STATE.RESET.CONFIRMED.YES) {
        resetConceptState(confirmAction, dispatch, initialState)
        setConfirmAction(null)
        setConfirmReset(false)
        return
      }

      if (isResetAction(action)) {
        setConfirmAction(action)
        setConfirmReset(true)
        return
      }

      dispatch(action)
    },
    [confirmAction, dispatch, initialState, setConfirmReset]
  )
}

export default useModifyConcept
