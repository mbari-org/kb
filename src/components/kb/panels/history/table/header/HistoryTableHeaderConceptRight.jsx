import { use } from 'react'

import ConceptExtent from '@/components/common/concept/ConceptExtent'
import HistoryContext from '@/contexts/panels/history/HistoryContext'

import CONFIG from '@/text'

const HistoryTableHeaderConceptRight = () => {
  const { conceptState, updateConceptState } = use(HistoryContext)

  return (
    <ConceptExtent
      initialValue={conceptState.extent}
      label={CONFIG.PANELS.HISTORY.EXTENT.LABEL}
      labelTooltip={CONFIG.PANELS.HISTORY.TOOLTIP.EXTENT.LABEL}
      childrenTooltip={CONFIG.PANELS.HISTORY.TOOLTIP.EXTENT.BUTTON.CHILDREN}
      descendantsTooltip={CONFIG.PANELS.HISTORY.TOOLTIP.EXTENT.BUTTON.DESCENDANTS}
      onChange={extent => updateConceptState({ extent })}
    />
  )
}

export default HistoryTableHeaderConceptRight
