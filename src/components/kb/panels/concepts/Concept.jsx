import { use } from 'react'

import { Box } from '@mui/material'

import ConceptView from '@/components/kb/panels/concepts/concept/ConceptView'
import ConceptPath from '@/components/kb/panels/concepts/concept/ConceptPath'
import ConceptEditingActions from '@/components/kb/panels/concepts/concept/ConceptEditingActions'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const Concept = () => {
  const { stagedState } = use(ConceptContext)

  if (stagedState && Object.keys(stagedState).length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        m: 2,
        mt: 1,
        height: '100vh',
        position: 'relative',
      }}
    >
      <ConceptPath />
      <ConceptView />
      <ConceptEditingActions />
    </Box>
  )
}

export default Concept
