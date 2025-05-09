import { useCallback, useState } from 'react'

import { isResetAction, resetConceptState } from '@/contexts/concept/lib/edit/resetConceptState'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const useModifyConcept = (dispatch, initialState, setConfirmDiscard, setEditing) => {
  const [confirmingDiscard, setConfirmingDiscard] = useState(null)

  return useCallback(
    action => {
      if (action.type === CONFIRMED.NO) {
        setConfirmDiscard(null)
        return
      }

      if (action.type === CONFIRMED.YES) {
        resetConceptState(confirmingDiscard, dispatch, initialState)
        setConfirmDiscard(null)
        setConfirmingDiscard(null)
        if (action.type === TO_INITIAL) {
          setEditing(false)
        }
        return
      }

      if (isResetAction(action)) {
        setConfirmDiscard(action)
        setConfirmingDiscard(action)
        return
      }

      dispatch(action)
    },
    [confirmingDiscard, dispatch, initialState, setConfirmDiscard, setEditing]
  )
}

export default useModifyConcept
