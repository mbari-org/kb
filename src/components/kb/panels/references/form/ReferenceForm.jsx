import { Stack } from '@mui/material'

import ReferenceTextInputs from './ReferenceTextInputs'
import ReferenceConceptsInput from './ReferenceConceptsInput'

import useReferenceForm from '@/components/kb/panels/references/form/useReferenceForm'

const ReferenceForm = ({ isEdit = false, onChange, reference }) => {
  const {
    handleConceptAdd,
    handleConceptDelete,
    handleFieldChange,
    handleConceptSelect,
    selectedConcept,
  } = useReferenceForm({ isEdit, onChange, reference })

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <ReferenceTextInputs handleFieldChange={handleFieldChange} reference={reference} />
      <ReferenceConceptsInput
        handleConceptAdd={handleConceptAdd}
        handleConceptDelete={handleConceptDelete}
        handleConceptSelect={handleConceptSelect}
        selectedConcept={selectedConcept}
        reference={reference}
      />
    </Stack>
  )
}

export default ReferenceForm
