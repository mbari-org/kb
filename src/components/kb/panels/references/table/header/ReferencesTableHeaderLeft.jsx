import { use } from 'react'
import { Box, FormControlLabel, Switch } from '@mui/material'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT_SELECT } from '@/lib/constants'

const ReferencesTableHeaderLeft = () => {
  const { references } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const byConcept = getSelected('byConcept')
  const byConceptName = byConcept ? selectedConcept : null

  const referencesExport = useReferencesExport()

  const filteredReferences = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept))
    : references

  const total = filteredReferences.length

  const handleToggleChange = event => {
    const newValue = event.target.checked
    select({ byConcept: newValue })
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: CONCEPT_SELECT.WIDTH,
      }}
    >
      <PanelTotalExport
        count={total}
        exportFn={() => referencesExport(filteredReferences, byConceptName)}
      />
      <Box>
        <FormControlLabel
          sx={{ margin: 0 }}
          control={<Switch size='small' checked={byConcept} onChange={handleToggleChange} />}
          label='By Concept'
        />
      </Box>
    </Box>
  )
}

export default ReferencesTableHeaderLeft
