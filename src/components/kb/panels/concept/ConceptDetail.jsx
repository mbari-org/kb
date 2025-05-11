import { Stack } from '@mui/material'

import ConceptAliases from './detail/ConceptAliases'
import ConceptAuthor from './detail/ConceptAuthor'
import ConceptMedia from './detail/ConceptMedia'
import ConceptName from './detail/ConceptName'
import ConceptRank from './detail/ConceptRank'

const ConceptDetail = () => {
  return (
    <Stack direction='row' spacing={1.5} sx={{ height: '100%' }}>
      <ConceptMedia />
      <Stack direction='column' spacing={2} sx={{ flex: '1', ml: 1, mr: 1, textAlign: 'left' }}>
        <ConceptName />
        <ConceptAuthor />
        <ConceptRank />
        <ConceptAliases />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
