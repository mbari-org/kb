import { useCallback, useState } from 'react'

import { isResetAction, resetConceptState } from '@/contexts/concept/lib/edit/resetConceptState'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const useModifyConcept = (dispatch, initialState, setConfirmReset, setEditing) => {
  const [confirmAction, setConfirmAction] = useState(null)

  return useCallback(
    action => {
      if (action.type === CONFIRMED.NO) {
        setConfirmAction(null)
        setConfirmReset(false)
        return
      }

      if (action.type === CONFIRMED.YES) {
        resetConceptState(confirmAction, dispatch, initialState)
        setConfirmAction(null)
        setConfirmReset(false)
        if (confirmAction.type === TO_INITIAL) {
          setEditing(false)
        }
        return
      }

      if (isResetAction(action)) {
        setConfirmAction(action)
        setConfirmReset(true)
        return
      }

      dispatch(action)
    },
    [confirmAction, dispatch, initialState, setConfirmReset, setEditing]
  )
}

export default useModifyConcept
