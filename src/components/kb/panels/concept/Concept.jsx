import { use } from 'react'

import { Stack } from '@mui/material'

import ConceptEditingActions from './detail/ConceptEditingActions'
import ConceptDetail from './ConceptDetail'
import ConceptPath from './ConceptPath'
import ConceptViewToggle from './toggleView/ConceptViewToggle'

import { isReadOnly } from '@/lib/auth/role'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

const Concept = () => {
  const { user } = use(AuthContext)
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
        <ConceptViewToggle />
      </Stack>
      <ConceptDetail />
      {!isReadOnly(user) && <ConceptEditingActions />}
    </Stack>
  )
}

export default Concept
