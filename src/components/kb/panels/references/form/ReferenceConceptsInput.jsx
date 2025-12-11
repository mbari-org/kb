import { TextField, Stack } from '@mui/material'
import { useState } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ReferenceConceptsDropDown from './ReferenceConceptsDropDown'
import KBTooltip from '@/components/common/KBTooltip'

import CONFIG from '@/text'

const ReferenceConceptsInput = ({
  handleConceptAdd,
  handleConceptDelete,
  handleSearchInput,
  isEdit = false,
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

  const hasConcepts = reference.concepts?.length > 0
  const conceptsTextField = (
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
  )

  return (
    <Stack spacing={0.5}>
      {hasConcepts ? (
        <KBTooltip placement='top' title={CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.TOOLTIP.REMOVE}>
          {conceptsTextField}
        </KBTooltip>
      ) : (
        conceptsTextField
      )}
      <ReferenceConceptsDropDown
        anchorEl={anchorEl}
        concepts={reference.concepts}
        onClose={handleMenuClose}
        onConceptClick={handleClickedConcept}
      />
      <KBTooltip placement='top' title={CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.TOOLTIP.ADD}>
        <div>
          <ConceptSelect
            conceptName={selectedConcept}
            doConceptSelected={handleConceptAdd}
            label={CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.LABEL}
            keepFocus={true}
            onInputChange={handleSearchInput}
            updateConceptSelected={false}
            width='100%'
          />
        </div>
      </KBTooltip>
    </Stack>
  )
}

export default ReferenceConceptsInput
