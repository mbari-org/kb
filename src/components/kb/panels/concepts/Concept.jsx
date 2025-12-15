import { use } from 'react'

import { Stack } from '@mui/material'

import ConceptEditingActions from '@/components/kb/panels/concepts/concept/ConceptEditingActions'
import ConceptView from '@/components/kb/panels/concepts/concept/ConceptView'
import ConceptPath from '@/components/kb/panels/concepts/concept/ConceptPath'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const Concept = () => {
  const { stagedState } = use(ConceptContext)

  if (stagedState && Object.keys(stagedState).length === 0) {
    return null
  }

  return (
    <Stack
      direction='column'
      spacing={1.5}
      sx={{
        m: 2,
        mt: 1,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <ConceptPath />
      </Stack>
      <ConceptView />
      <ConceptEditingActions />
    </Stack>
  )
}

export default Concept
