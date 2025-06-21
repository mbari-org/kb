import { Stack } from '@mui/material'

import ConceptAliases from '@/components/kb/panels/concepts/concept/detail/ConceptAliases'
import ConceptAuthor from '@/components/kb/panels/concepts/concept/detail/ConceptAuthor'
import ConceptMedia from '@/components/kb/panels/concepts/concept/detail/ConceptMedia'
import ConceptName from '@/components/kb/panels/concepts/concept/detail/ConceptName'
import ConceptRank from '@/components/kb/panels/concepts/concept/detail/ConceptRank'
import ConceptReferences from '@/components/kb/panels/concepts/concept/detail/ConceptReferences'

const ConceptDetail = () => {
  return (
    <Stack direction='row' spacing={1.5} sx={{ height: '100%' }}>
      <ConceptMedia />
      <Stack direction='column' spacing={2} sx={{ flex: '1', ml: 1, mr: 1, textAlign: 'left' }}>
        <ConceptName />
        <ConceptAuthor />
        <ConceptRank />
        <ConceptAliases />
        <ConceptReferences />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
