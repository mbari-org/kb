import { use, useCallback } from 'react'

import { isResetAction, resetEditingState } from '@/contexts/concept/lib/edit/resetEditingState'

import ModalContext from '@/contexts/modal/ModalContext'

import useWhyDidYouUpdate from '@/lib/hooks/useWhyDidYouUpdate'

const useModifyConcept = (dispatch, initialState) => {
  const { data, setData } = use(ModalContext)

  const resetConcept = useCallback(
    () => resetEditingState(dispatch, initialState, data, setData),
    [dispatch, initialState, data, setData]
  )

  useWhyDidYouUpdate('useModifyConcept', { dispatch, initialState, data, setData })

  return useCallback(
    action => (isResetAction(action) ? resetConcept(action) : dispatch(action)),
    [dispatch, resetConcept]
  )
}

export default useModifyConcept
