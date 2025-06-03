import { use } from 'react'
import { Box, Button, Typography, Switch, FormControlLabel } from '@mui/material'

import ConceptSearch from '@/components/common/ConceptSearch'
import PanelTitle from '@/components/common/PanelTitle'

import useAddReferenceModal from '@/components/kb/panels/references/add/useAddReference'

import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ReferencesHeader = () => {
  const { addReference, references } = use(ReferencesContext)
  const { select, selected } = use(SelectedContext)

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
    select({
      byConcept: newValue,
      concept: newValue ? selected.concept : null,
    })
  }

  return (
    <Box>
      <PanelTitle title='References' />
      <Box sx={{ ml: 1, mt: -9, width: 400 }}>
        <ConceptSearch
          conceptName={selected.concept}
          handleConceptSelect={handleConceptSelect}
          handleKeyUp={handleKeyUp}
          disabled={!selected.byConcept}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 1, gap: 2 }}>
          <Typography variant='body1'>Total: {references?.length || 0}</Typography>
          <FormControlLabel
            control={
              <Switch size='small' checked={selected.byConcept} onChange={handleToggleChange} />
            }
            label='By Concept'
            sx={{ ml: 2 }}
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
