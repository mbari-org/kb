import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import useDebounce from '@/lib/hooks/useDebounce'

const useDebounceModifyAlias = actionType => {
  const { modifyConcept } = use(ConceptContext)

  const modifyConceptAlias = useCallback(
    update => {
      modifyConcept({
        type: actionType,
        update: {
          ...update,
          action: actionType,
        },
      })
    },
    [actionType, modifyConcept]
  )

  const debounceModifyConcept = useDebounce(update => modifyConceptAlias(update))

  return debounceModifyConcept
}

export default useDebounceModifyAlias
