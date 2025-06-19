import { Box } from '@mui/material'
import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ToConceptSpecial from '@/components/common/concept/ToConceptSpecial'

import { CONCEPT_SELECT } from '@/lib/constants'

const ToConceptSelect = ({ conceptName, disabled, doConceptSelect, required = true, sx }) => {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Box sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
        <ToConceptSpecial onChange={specialName => doConceptSelect(specialName)} />
      </Box>
      <ConceptSelect
        conceptName={conceptName}
        disabled={disabled}
        doConceptSelect={doConceptSelect}
        label={CONCEPT_SELECT.TO_CONCEPT_LABEL}
        navigation={false}
        required={required}
      />
    </Box>
  )
}

export default ToConceptSelect
