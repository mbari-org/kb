import { Stack } from '@mui/material'

import ConceptAliases from '@/components/kb/panels/concepts/change/staged/concept/aliases/ConceptAliases'
import ConceptAuthor from '@/components/kb/panels/concepts/change/staged/concept/field/ConceptAuthor'
import ConceptMedia from '@/components/kb/panels/concepts/change/staged/concept/media/ConceptMedia'
import ConceptName from '@/components/kb/panels/concepts/change/staged/concept/field/ConceptName'
import ConceptRank from '@/components/kb/panels/concepts/change/staged/concept/field/ConceptRank'
import ConceptReferences from '@/components/kb/panels/concepts/ConceptReferences'

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
