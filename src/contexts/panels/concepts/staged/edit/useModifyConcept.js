import { useCallback, useState } from 'react'

import {
  isResetAction,
  resetConceptState,
} from '@/contexts/panels/concepts/staged/edit/resetConceptState'

import { RESETTING } from '@/lib/constants/constants'

const { CONFIRMED } = RESETTING

const useModifyConcept = (dispatch, initialState, setConfirmReset) => {
  const [confirmingDiscard, setConfirmingDiscard] = useState(null)

  return useCallback(
    action => {
      if (action.type === CONFIRMED.NO) {
        setConfirmReset(null)
        return
      }

      if (action.type === CONFIRMED.YES) {
        if (confirmingDiscard) {
          resetConceptState(confirmingDiscard, dispatch, initialState)
        }
        setConfirmReset(null)
        setConfirmingDiscard(null)
        return
      }

      if (isResetAction(action)) {
        setConfirmReset(action)
        setConfirmingDiscard(action)
        return
      }

      dispatch(action)
    },
    [confirmingDiscard, dispatch, initialState, setConfirmReset]
  )
}

export default useModifyConcept
