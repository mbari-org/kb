import { use, useState } from 'react'
import { Box, Button, Typography, Switch, FormControlLabel } from '@mui/material'

import ConceptSelect from '@/components/common/ConceptSelect'
import PanelTitle from '@/components/common/PanelTitle'

import useAddReferenceModal from '@/components/kb/panels/references/add/useAddReference'

import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const SEARCH_WIDTH = 400

const ReferencesHeader = () => {
  const { addReference, references } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected('concept')

  const [byConcept, setByConcept] = useState(getSelected('byConcept'))

  const addReferenceModal = useAddReferenceModal(addReference, references)

  const handleConceptSelect = (_event, selectedName) => {
    if (selectedName) {
      select({ concept: selectedName })
    }
  }

  const handleKeyUp = (event, taxonomyNames) => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (taxonomyNames.includes(conceptName)) {
        select({ concept: conceptName })
        document.activeElement.blur()
      }
    }
  }

  const handleToggleChange = event => {
    const newValue = event.target.checked
    select({ byConcept: newValue })
    setByConcept(newValue)
  }

  return (
    <Box>
      <PanelTitle title='References' />
      <ConceptSelect
        conceptName={selectedConcept}
        disabled={!byConcept}
        handleConceptSelect={handleConceptSelect}
        handleKeyUp={handleKeyUp}
        sx={{ ml: 1, mt: -9, width: SEARCH_WIDTH }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 2,
            mt: 1,
            width: SEARCH_WIDTH,
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='body1'>Total: {references?.length || 0}</Typography>
          <FormControlLabel
            control={<Switch size='small' checked={byConcept} onChange={handleToggleChange} />}
            label='By Concept'
          />
        </Box>
        <Button variant='contained' color='primary' onClick={addReferenceModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

export default ReferencesHeader
