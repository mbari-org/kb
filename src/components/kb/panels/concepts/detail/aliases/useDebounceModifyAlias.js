import { use, useCallback } from 'react'

import useDebounce from '@/components/hooks/useDebounce'
import ConceptContext from '@/contexts/concept/ConceptContext'

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
