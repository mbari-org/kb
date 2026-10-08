import ConceptSelectAuxiliary from '@/components/common/concept/ConceptSelectAuxiliary'
import ToConceptSpecial from '@/components/common/concept/ToConceptSpecial'

import CONFIG from '@/lib/config'

const ToConceptSelectAuxiliary = ({ onChange }) => {
  return (
    <ConceptSelectAuxiliary
      label={CONFIG.CONCEPT.SELECT.TO_CONCEPT}
      components={[null, <ToConceptSpecial key='to-concept-special' onChange={onChange} />]}
    />
  )
}

export default ToConceptSelectAuxiliary
