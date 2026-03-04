import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import ToConceptSpecial from '@/components/common/concept/ToConceptSpecial'

import CONFIG from '@/text'

const ToConceptSelectAuxiliary = ({ disabled = false, onChange }) => {
  return (
    <ConceptSelectAuxiliary
      disabled={disabled}
      label={CONFIG.CONCEPT.SELECT.TO_CONCEPT}
      components={[null, <ToConceptSpecial onChange={onChange} />]}
    />
  )
}

export default ToConceptSelectAuxiliary