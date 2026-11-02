import { TextField, Stack } from '@mui/material'
import { useState } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'
import ReferenceConceptsDropDown from './ReferenceConceptsDropDown'

import { compareIgnoreCase } from './useReferenceForm'

import CONFIG from '@/lib/config'

const ReferenceConceptsInput = ({
  handleConceptAdd,
  handleConceptDelete,
  handleSearchInput,
  reference,
  selectedConcept,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const onInputChange = (event, value) => {
    setInputValue(value)
    handleSearchInput(event, value)
  }

  const onConceptAdd = concept => {
    handleConceptAdd(concept)
    setInputValue('')
  }

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

  const sortedConcepts = [...(reference.concepts || [])].sort(compareIgnoreCase)
  const hasConcepts = reference.concepts?.length > 0
  const conceptsTextField = (
    <TextField
      fullWidth
      label='Concepts'
      multiline
      onChange={handleConceptDelete}
      onClick={handleTextFieldClick}
      placeholder='Add concepts using the search box below'
      slotProps={{
        input: {
          readOnly: true,
        },
      }}
      value={sortedConcepts.join(', ')}
    />
  )

  return (
    <Stack spacing={0.5}>
      {hasConcepts ? (
        <KBTooltipTarget
          placement='top'
          title={CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.TOOLTIP.REMOVE}
          wrapper='div'
          wrapperSx={{ display: 'block', width: '100%' }}
        >
          {conceptsTextField}
        </KBTooltipTarget>
      ) : (
        conceptsTextField
      )}
      <ReferenceConceptsDropDown
        anchorEl={anchorEl}
        concepts={sortedConcepts}
        onClose={handleMenuClose}
        onConceptClick={handleClickedConcept}
      />
      <ConceptSelect
        conceptName={selectedConcept}
        doConceptSelected={onConceptAdd}
        label={CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.LABEL}
        inputValue={inputValue}
        keepFocus={true}
        onInputChange={onInputChange}
        selectorTooltip={{ placement: 'top', title: CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.TOOLTIP.ADD }}
        updateConceptSelected={false}
        width='100%'
      />
    </Stack>
  )
}

export default ReferenceConceptsInput
