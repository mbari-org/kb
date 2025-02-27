import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import useDebounce from '@/lib/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

const useDebounceChangePrimaryName = () => {
  const { modifyConcept } = use(ConceptContext)

  const modifyPrimaryName = useCallback(
    name => {
      modifyConcept({
        type: CONCEPT_STATE.STRUCTURE.NAME_CHANGE,
        update: { field: 'name', value: name },
      })
    },
    [modifyConcept]
  )

  const debouncedChangePrimaryName = useDebounce(modifyPrimaryName)

  return debouncedChangePrimaryName
}

export default useDebounceChangePrimaryName
