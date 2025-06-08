import { TextField, Stack } from '@mui/material'
import { useState } from 'react'

import ReferenceConceptsDropDown from './ReferenceConceptsDropDown'
import ReferenceConceptSelect from './ReferenceConceptSelect'

const ReferenceConceptsInput = ({ reference, handleChange, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleTextFieldClick = event => {
    if (reference.concepts?.length > 0) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleConceptClick = concept => {
    const updatedReference = {
      ...reference,
      concepts: reference.concepts.filter(c => c !== concept),
    }
    handleChange('concepts')({ target: { value: updatedReference.concepts.join(', ') } })
    handleMenuClose()
  }

  return (
    <Stack spacing={0.5}>
      <TextField
        fullWidth
        label='Concepts'
        onChange={handleChange('concepts')}
        onClick={handleTextFieldClick}
        placeholder='Enter concept names using the search box below'
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        value={reference.concepts?.join(', ') || ''}
      />
      <ReferenceConceptsDropDown
        anchorEl={anchorEl}
        concepts={reference.concepts}
        onClose={handleMenuClose}
        onConceptClick={handleConceptClick}
      />
      <ReferenceConceptSelect reference={reference} onChange={onChange} />
    </Stack>
  )
}

export default ReferenceConceptsInput
