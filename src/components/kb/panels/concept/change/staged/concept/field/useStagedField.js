import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { updateInfo } from '@/contexts/concept/staged/edit/stateUpdates'

const useStagedField = field => {
  const { initialState, stagedState } = use(ConceptContext)

  const { hasUpdated } = updateInfo(initialState, stagedState)

  const hasUpdatedField = hasUpdated(field)

  const borderStyle = hasUpdatedField ? 'dashed' : 'none'
  const borderColor = hasUpdatedField ? 'edit.main' : 'transparent'

  return {
    borderStyle,
    borderColor,
  }
}

export default useStagedField
