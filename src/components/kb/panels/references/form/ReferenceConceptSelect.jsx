import { Box, Stack } from '@mui/material'

import ConceptSelect from '@/components/common/ConceptSelect'
import ReferenceConceptSelectButtons from './ReferenceConceptSelectButtons'
import useReferenceForm from '@/components/kb/panels/references/useReferenceForm'

const ReferenceConceptSelect = ({ reference, onChange }) => {
  const {
    handleAddConcept,
    handleDeleteConcept,
    handleConceptSelect,
    handleKeyUp,
    handleSearchInput,
    selectedConcept,
  } = useReferenceForm({ reference, onChange, isEdit: true })

  const isConceptSelected = selectedConcept && reference.concepts?.includes(selectedConcept)

  return (
    <Stack alignItems='center' direction='row' justifyContent='center' spacing={1}>
      <ReferenceConceptSelectButtons
        handleAddConcept={handleAddConcept}
        handleDeleteConcept={handleDeleteConcept}
        isConceptSelected={isConceptSelected}
        selectedConcept={selectedConcept}
      />
      <Box sx={{ width: 8 }} />
      <Box sx={{ width: '50%' }}>
        <ConceptSelect
          conceptName={selectedConcept}
          handleConceptSelect={handleConceptSelect}
          handleKeyUp={handleKeyUp}
          navigation={false}
          onInputChange={handleSearchInput}
        />
      </Box>
    </Stack>
  )
}

export default ReferenceConceptSelect
