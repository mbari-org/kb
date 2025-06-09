import { use } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'

import ReferencesContext from '@/contexts/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ConceptReferences = () => {
  const { getReferences } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const conceptReferences = getReferences(selectedConcept)

  const linkToReferences = () => {
    select({ byConcept: true, panel: 'References' })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        References DOIs
      </Typography>
      <IconButton
        onClick={linkToReferences}
        size='small'
        disabled={!conceptReferences?.length}
        sx={{
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <InspectIcon />
      </IconButton>
    </Box>
  )
}

export default ConceptReferences
