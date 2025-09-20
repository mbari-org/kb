import { useState } from 'react'
import { Box } from '@mui/material'

import ConceptExtent from '@/components/common/concept/ConceptExtent'

import { CONCEPT_EXTENT } from '@/lib/constants'

const ExportConceptContent = () => {
  const [conceptExtent, setConceptExtent] = useState(CONCEPT_EXTENT.CONCEPT)

  return (
    <Box>
      <ConceptExtent
        initialValue={conceptExtent}
        onChange={setConceptExtent}
      />
    </Box>
  )
}

export default ExportConceptContent