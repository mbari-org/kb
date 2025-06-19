import { Box, Stack } from '@mui/material'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ReferenceConceptSelectButtons from './ReferenceConceptSelectButtons'

import useReferenceForm from '@/components/kb/panels/references/form/useReferenceForm'

const ReferenceConceptSelect = ({ onChange, reference }) => {
  const { handleAddConcept, handleDeleteConcept, handleSearchInput, selectedConcept } =
    useReferenceForm({ reference, onChange, isEdit: true })

  const isConceptSelected = selectedConcept && reference.concepts?.includes(selectedConcept)

  return (
    <Stack alignItems='center' direction='row' justifyContent='left' spacing={1}>
      <ConceptSelect
        conceptName={selectedConcept}
        label='Add Concept'
        onInputChange={handleSearchInput}
      />
      <Box sx={{ width: 6 }} />
      <ReferenceConceptSelectButtons
        handleAddConcept={handleAddConcept}
        handleDeleteConcept={handleDeleteConcept}
        isConceptSelected={isConceptSelected}
        selectedConcept={selectedConcept}
      />
    </Stack>
  )
}

export default ReferenceConceptSelect
