import ConceptSelect from '@/components/common/concept/ConceptSelect'

import { CONCEPT_SELECT } from '@/lib/constants'

const { TO_CONCEPT_LABEL, RIGHT_COMPONENT } = CONCEPT_SELECT
const { SPECIAL } = RIGHT_COMPONENT

const ToConceptSelect = ({ conceptName, disabled, doConceptSelected, required = true }) => {
  return (
    <ConceptSelect
      conceptName={conceptName}
      disabled={disabled}
      doConceptSelected={doConceptSelected}
      label={TO_CONCEPT_LABEL}
      rightComponent={SPECIAL}
      required={required}
      updateConceptSelected={false}
    />
  )
}

export default ToConceptSelect
