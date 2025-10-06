import { TextField, Stack } from '@mui/material'
import { useState } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ReferenceConceptsDropDown from './ReferenceConceptsDropDown'

const ReferenceConceptsInput = ({
  handleConceptAdd,
  handleConceptDelete,
  handleSearchInput,
  reference,
  selectedConcept,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleTextFieldClick = event => {
    if (reference.concepts?.length > 0) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleClickedConcept = concept => {
    handleConceptDelete(concept)
    handleMenuClose()
  }

  return (
    <Stack spacing={0.5}>
      <TextField
        fullWidth
        label='Concepts'
        onChange={handleConceptDelete}
        onClick={handleTextFieldClick}
        placeholder='Add concepts using the search box below'
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
        onConceptClick={handleClickedConcept}
      />
      <ConceptSelect
        conceptName={selectedConcept}
        doConceptSelected={handleConceptAdd}
        label='Add Concept'
        keepFocus={true}
        onInputChange={handleSearchInput}
        updateConceptSelected={false}
        width='100%'
      />
    </Stack>
  )
}

export default ReferenceConceptsInput
