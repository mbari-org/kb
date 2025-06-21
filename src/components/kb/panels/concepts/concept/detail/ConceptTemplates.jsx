import { Box, Typography } from '@mui/material'

import ConceptDetailNone from '@/components/kb/panels/concepts/concept/detail/ConceptDetailNone'

const ConceptTemplates = () => {
  const hasTemplates = false

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Templates
        </Typography>
      </Box>
      <ConceptDetailNone display={!hasTemplates} />
    </Box>
  )
}

export default ConceptTemplates
