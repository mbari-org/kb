import { Box, Stack } from '@mui/material'

import ReferenceTextInputs from './ReferenceTextInputs'
import ReferenceConceptsInput from './ReferenceConceptsInput'
import ReferenceDiscardAlert from '@/components/modal/actions/ReferenceDiscardAlert'

import { useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import useReferenceForm from '@/components/kb/panels/references/form/useReferenceForm'

const ReferenceForm = ({ isEdit = false, onChange, reference, original }) => {
  const {
    handleConceptAdd,
    handleConceptDelete,
    handleFieldChange,
    handleConceptSearchInput,
    selectedConcept,
  } = useReferenceForm({ isEdit, onChange, reference, original })

  const { modalData } = useReferencesModalDataContext()
  const isDiscard = !!modalData?.confirmDiscard

  return (
    <Stack spacing={2} sx={{ p: 1, width: 500 }}>
      <ReferenceTextInputs handleFieldChange={handleFieldChange} reference={reference} />
      <ReferenceConceptsInput
        handleConceptAdd={handleConceptAdd}
        handleConceptDelete={handleConceptDelete}
        handleSearchInput={handleConceptSearchInput}
        selectedConcept={selectedConcept}
        reference={reference}
      />
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', pt: isDiscard ? 0.5 : 0 }}>
        {isDiscard ? <ReferenceDiscardAlert /> : null}
      </Box>
    </Stack>
  )
}

export default ReferenceForm
