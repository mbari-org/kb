import { useCallback } from 'react'

import { RESET_TYPES } from '@/contexts/concept/lib/useResetConcept'

const useModifyConcept = (dispatch, resetConcept) => {
  return useCallback(
    action => {
      RESET_TYPES.includes(action.type) ? resetConcept(action) : dispatch(action)
    },
    [dispatch, resetConcept]
  )
}

export default useModifyConcept
