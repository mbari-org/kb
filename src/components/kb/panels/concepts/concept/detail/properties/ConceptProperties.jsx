import { Stack } from '@mui/material'

import ConceptAliases from '@/components/kb/panels/concepts/concept/detail/ConceptAliases'
import ConceptRealizations from '@/components/kb/panels/concepts/concept/detail/ConceptRealizations'
import ConceptReferences from '@/components/kb/panels/concepts/concept/detail/ConceptReferences'
import ConceptTemplates from '@/components/kb/panels/concepts/concept/detail/ConceptTemplates'

const ConceptProperties = () => {
  return (
    <Stack
      direction='column'
      spacing={2}
      sx={{
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 250px)', // Increased to account for absolute positioned ConceptEditingActions
        pr: 1, // Add some padding for the scrollbar
      }}
    >
      <ConceptAliases />
      <ConceptReferences />
      <ConceptTemplates />
      <ConceptRealizations />
    </Stack>
  )
}

export default ConceptProperties
