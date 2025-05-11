import { Stack } from '@mui/material'

import ConceptAliases from './change/staged/concept/ConceptAliases'
import ConceptAuthor from './change/staged/concept/ConceptAuthor'
import ConceptMedia from './change/staged/concept/ConceptMedia'
import ConceptName from './change/staged/concept/ConceptName'
import ConceptRank from './change/staged/concept/ConceptRank'

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
