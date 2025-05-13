import { useCallback, useState } from 'react'

import { isResetAction, resetConceptState } from '@/contexts/concept/lib/edit/resetConceptState'

import { CONCEPT_STATE } from '@/lib/constants'

const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const useModifyConcept = (dispatch, initialState, setConfirmReset, setEditing) => {
  const [confirmingDiscard, setConfirmingDiscard] = useState(null)

  return useCallback(
    action => {
      if (action.type === CONFIRMED.NO) {
        setConfirmReset(null)
        return
      }

      if (action.type === CONFIRMED.YES) {
        resetConceptState(confirmingDiscard, dispatch, initialState)
        setConfirmReset(null)
        setConfirmingDiscard(null)
        if (action.type === TO_INITIAL) {
          setEditing(false)
        }
        return
      }

      if (isResetAction(action)) {
        setConfirmReset(action)
        setConfirmingDiscard(action)
        return
      }

      dispatch(action)
    },
    [confirmingDiscard, dispatch, initialState, setConfirmReset, setEditing]
  )
}

export default useModifyConcept
