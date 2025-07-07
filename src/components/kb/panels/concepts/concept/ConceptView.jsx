import { Stack } from '@mui/material'

import ConceptMedia from '@/components/kb/panels/concepts/concept/detail/ConceptMedia'
import ConceptName from '@/components/kb/panels/concepts/concept/detail/ConceptName'
import ConceptProperties from '@/components/kb/panels/concepts/concept/detail/properties/ConceptProperties'

const ConceptView = () => {
  return (
    <Stack direction='row' spacing={1.5} sx={{ height: '100%' }}>
      <ConceptMedia />
      <Stack direction='column' spacing={2} sx={{ flex: '1', ml: 1, mr: 1, textAlign: 'left' }}>
        <ConceptName />
        <ConceptProperties />
      </Stack>
    </Stack>
  )
}

export default ConceptView
