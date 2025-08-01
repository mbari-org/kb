import { use } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptRealizations = () => {
  const { editing, stagedState } = use(ConceptContext)

  const realizations = stagedState?.realizations || []

  // Sort realizations by linkName for consistent display
  const sortedRealizations = [...realizations].sort((a, b) => 
    a.linkName.localeCompare(b.linkName)
  )

  const IconComponent = () => (
    <RealizationModifyIcon
      action={CONCEPT_STATE.REALIZATION.ADD}
      realizationIndex={realizations.length}
      size={20}
    />
  )

  return (
    <Box>
      <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Realizations
        </Typography>
        {editing && <IconComponent />}
      </Stack>
      <Stack direction='column' spacing={1}>
        {sortedRealizations.map((realization, sortedIndex) => {
          // Find the original index for proper action handling
          const originalIndex = realizations.findIndex(r => 
            r.linkName === realization.linkName && 
            r.toConcept === realization.toConcept && 
            r.linkValue === realization.linkValue
          )
          const realizationWithCorrectIndex = {
            ...realization,
            index: originalIndex,
          }
          return (
            <ConceptRealization 
              key={`${realization.linkName}-${realization.toConcept}-${sortedIndex}`}
              realization={realizationWithCorrectIndex} 
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default ConceptRealizations
