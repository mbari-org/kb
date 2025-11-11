import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants/constants'

const useOnReset = (group, index) => {
  const { modifyConcept } = use(ConceptContext)

  return useCallback(() => {
    modifyConcept({
      type: CONCEPT_STATE.RESET[group.toUpperCase()],
      update: { index },
    })
  }, [group, index, modifyConcept])
}

export default useOnReset
