import { Stack, Box } from '@mui/material'

import ConceptMedia from '@/components/kb/panels/concepts/concept/detail/ConceptMedia'
import ConceptName from '@/components/kb/panels/concepts/concept/detail/ConceptName'
import ConceptAuthor from '@/components/kb/panels/concepts/concept/detail/ConceptAuthor'
import ConceptRank from '@/components/kb/panels/concepts/concept/detail/ConceptRank'
import ConceptProperties from '@/components/kb/panels/concepts/concept/detail/properties/ConceptProperties'

const ConceptView = () => {
  return (
    <Stack direction='row' spacing={1.5} sx={{ height: '100%' }}>
      <ConceptMedia />
      <Box sx={{ flex: '1', ml: 1, mr: 1, textAlign: 'left' }}>
        <Stack direction='column' spacing={2}>
          <ConceptName />
          <ConceptAuthor />
          <ConceptRank />
        </Stack>
        <Box sx={{ mt: 4 }}>
          <ConceptProperties />
        </Box>
      </Box>
    </Stack>
  )
}

export default ConceptView
