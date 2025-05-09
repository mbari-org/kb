import { useCallback, useState } from 'react'

import { isResetAction, resetConceptState } from '@/contexts/concept/lib/edit/resetConceptState'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const useModifyConcept = (dispatch, initialState, setConfirmAction, setEditing) => {
  const [confirmingAction, setConfirmingAction] = useState(null)

  return useCallback(
    action => {
      if (action.type === CONFIRMED.NO) {
        setConfirmAction(null)
        return
      }

      if (action.type === CONFIRMED.YES) {
        resetConceptState(confirmingAction, dispatch, initialState)
        setConfirmAction(null)
        setConfirmingAction(null)
        if (action.type === TO_INITIAL) {
          setEditing(false)
        }
        return
      }

      if (isResetAction(action)) {
        setConfirmAction(action)
        setConfirmingAction(action)
        return
      }

      dispatch(action)
    },
    [confirmingAction, dispatch, initialState, setConfirmAction, setEditing]
  )
}

export default useModifyConcept
