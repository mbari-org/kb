import { Box } from '@mui/material'
import ConceptSelect from '@/components/common/ConceptSelect'
import ToConceptSpecial from '@/components/common/ToConceptSpecial'

const ToConceptSelect = ({
  conceptName,
  disabled,
  doConceptSelect,
  required = true,
  width = '100%',
}) => {
  return (
    <Box sx={{ position: 'relative', width }}>
      <Box sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
        <ToConceptSpecial onChange={specialName => doConceptSelect(specialName)} />
      </Box>
      <ConceptSelect
        conceptName={conceptName}
        disabled={disabled}
        doConceptSelect={doConceptSelect}
        label='To Concept'
        navigation={false}
        required={required}
      />
    </Box>
  )
}

export default ToConceptSelect
