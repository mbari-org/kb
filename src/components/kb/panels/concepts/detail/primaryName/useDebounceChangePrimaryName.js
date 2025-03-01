import { use, useCallback } from 'react'

import useDebounce from '@/components/hooks/useDebounce'
import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

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
