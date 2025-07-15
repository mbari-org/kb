import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { createUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

const useStagedFieldBorder = field => {
  const { initialState, stagedState } = use(ConceptContext)

  const { hasUpdated } = createUpdatesInfo(initialState, stagedState)

  const hasUpdatedField = hasUpdated(field)

  const borderColor = hasUpdatedField ? 'edit.main' : 'transparent'
  const borderStyle = hasUpdatedField ? 'dashed' : 'none'
  const borderWidth = hasUpdatedField ? '2px' : '0px'

  return { borderColor, borderStyle, borderWidth }
}

export default useStagedFieldBorder
