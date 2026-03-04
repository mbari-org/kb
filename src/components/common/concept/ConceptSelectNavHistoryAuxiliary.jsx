import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import NavHistoryLinks from '@/components/common/NavHistoryLinks'

import CONFIG from '@/text'

const ConceptSelectNavHistoryAuxiliary = ({ concepts, disabled = false, left }) => {
  return (
    <ConceptSelectAuxiliary
      disabled={disabled}
      label={CONFIG.CONCEPT.SELECT.CONCEPT}
      left={left}
      right={<NavHistoryLinks history={concepts} />}
    />
  )
}

export default ConceptSelectNavHistoryAuxiliary