import ConceptSelect from '@/components/common/concept/ConceptSelect'

import { CONCEPT_SELECT } from '@/lib/constants'

const { TO_CONCEPT_LABEL, RIGHT_COMPONENT } = CONCEPT_SELECT
const { SPECIAL } = RIGHT_COMPONENT

const ToConceptSelect = ({
  conceptName,
  disabled,
  doConceptSelected,
  onSpecialChange,
  required = true,
  width,
}) => {
  return (
    <ConceptSelect
      conceptName={conceptName}
      disabled={disabled}
      doConceptSelected={doConceptSelected}
      onSpecialChange={onSpecialChange}
      label={TO_CONCEPT_LABEL}
      rightComponent={SPECIAL}
      required={required}
      updateConceptSelected={false}
      width={width}
    />
  )
}

export default ToConceptSelect
