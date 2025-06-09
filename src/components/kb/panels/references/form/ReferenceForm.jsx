import { Stack } from '@mui/material'

import ReferenceTextInputs from './ReferenceTextInputs'
import ReferenceConceptsInput from './ReferenceConceptsInput'

import useReferenceForm from '@/components/kb/panels/references/useReferenceForm'

const ReferenceForm = ({ isEdit = false, onChange, reference }) => {
  const { handleChange } = useReferenceForm({ isEdit, onChange, reference })

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <ReferenceTextInputs reference={reference} handleChange={handleChange} />
      <ReferenceConceptsInput
        reference={reference}
        handleChange={handleChange}
        onChange={onChange}
      />
    </Stack>
  )
}

export default ReferenceForm
