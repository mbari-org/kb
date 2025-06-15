import { useCallback } from 'react'

import { isStateModified } from '@/lib/constants'
import { isJsonEqual } from '@/lib/util'

const useIsModified = ({ initialState, stagedState }) => {
  const isModified = useCallback(
    (field, index) => {
      return field
        ? isStateModified(stagedState, initialState, field, index)
        : !isJsonEqual(stagedState, initialState)
    },
    [initialState, stagedState]
  )

  return isModified
}

export default useIsModified
