import { use } from 'react'
import { Box, Button, Typography, Switch, FormControlLabel } from '@mui/material'

import ConceptSelect from '@/components/common/ConceptSelect'
import PanelTitle from '@/components/common/PanelTitle'

import useAddReferenceModal from '@/components/kb/panels/references/add/useAddReference'
import useReferencesExport from '@/components/kb/panels/references/useReferencesExport'

import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const SEARCH_WIDTH = 400

const ReferencesHeader = () => {
  const { addReference, references } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const byConcept = getSelected('byConcept')

  const total = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept)).length
    : references.length

  const addReferenceModal = useAddReferenceModal(addReference)
  const referencesExport = useReferencesExport()

  const handleConceptSelect = (_event, selectedName) => {
    if (selectedName) {
      select({ concept: selectedName })
    }
  }

  const handleToggleChange = event => {
    const newValue = event.target.checked
    select({ byConcept: newValue })
  }

  return (
    <Box>
      <PanelTitle title='References' />
      <ConceptSelect
        conceptName={selectedConcept}
        disabled={!byConcept}
        handleConceptSelect={handleConceptSelect}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1'>Total: {total}</Typography>
            <Button onClick={referencesExport} sx={{ ml: 2 }}>
              Export
            </Button>
          </Box>
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
