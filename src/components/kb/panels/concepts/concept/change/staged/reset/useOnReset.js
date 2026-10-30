import { use, useCallback } from 'react'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const useOnReset = (group, index, stateId) => {
  const { modifyConcept } = use(ConceptStagedContext)

  return useCallback(() => {
    modifyConcept({
      type: CONCEPT_STATE.RESET[group.toUpperCase()],
      update: { index, stateId },
    })
  }, [group, index, stateId, modifyConcept])
}

export default useOnReset
