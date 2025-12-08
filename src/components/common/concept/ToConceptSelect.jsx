import ConceptSelect from '@/components/common/concept/ConceptSelect'

import { CONCEPT } from '@/lib/constants'
import { CONFIG } from '@/config/js/index.js'

const { RIGHT_COMPONENT } = CONCEPT.SELECT
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
      label={CONFIG.CONCEPT.SELECT.TO_CONCEPT}
      rightComponent={SPECIAL}
      required={required}
      updateConceptSelected={false}
      width={width}
    />
  )
}

export default ToConceptSelect
