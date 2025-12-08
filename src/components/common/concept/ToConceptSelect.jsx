import ConceptSelect from '@/components/common/concept/ConceptSelect'

import { CONCEPT } from '@/lib/constants.js'
import { UI_TEXT } from '@/config/js/text.js'

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
      label={UI_TEXT.CONCEPT.SELECT.TO_CONCEPT}
      rightComponent={SPECIAL}
      required={required}
      updateConceptSelected={false}
      width={width}
    />
  )
}

export default ToConceptSelect
