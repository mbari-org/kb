import { Stack } from '@mui/material'

import ReferenceTextInputs from './ReferenceTextInputs'
import ReferenceConceptsInput from './ReferenceConceptsInput'

import useReferenceForm from '@/components/kb/panels/references/form/useReferenceForm'

const ReferenceForm = ({ isEdit = false, onChange, reference, original }) => {
  const {
    handleConceptAdd,
    handleConceptDelete,
    handleFieldChange,
    handleConceptSearchInput,
    selectedConcept,
  } = useReferenceForm({ isEdit, onChange, reference, original })

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <ReferenceTextInputs handleFieldChange={handleFieldChange} reference={reference} />
      <ReferenceConceptsInput
        handleConceptAdd={handleConceptAdd}
        handleConceptDelete={handleConceptDelete}
        handleSearchInput={handleConceptSearchInput}
        selectedConcept={selectedConcept}
        reference={reference}
      />
    </Stack>
  )
}

export default ReferenceForm
