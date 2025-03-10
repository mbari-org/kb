import { useCallback } from 'react'

import { isStateModified } from '@/lib/kb/concept/state/conceptState'

import { getDeepDiff, isJsonEqual } from '@/lib/util'

const useConceptModified = ({ editing, initialState, stagedState }) => {
  const isConceptModified = useCallback(
    () => !isJsonEqual(stagedState, initialState),
    [stagedState, initialState]
  )

  const isFieldModified = useCallback(
    (field, index) => isStateModified(stagedState, initialState, field, index),
    [stagedState, initialState]
  )

  const isModified = useCallback(
    (field, index) => {
      if (!editing) return false

      return field ? isFieldModified(field, index) : isConceptModified()
    },
    [editing, isConceptModified, isFieldModified]
  )

  const getConceptUpdates = useCallback(
    () => getDeepDiff(stagedState, initialState),

    [initialState, stagedState]
  )

  return { getConceptUpdates, isModified }
}

export default useConceptModified
