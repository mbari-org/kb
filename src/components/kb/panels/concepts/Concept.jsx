import { use } from 'react'

import { Stack } from '@mui/material'

import ConceptEditingActions from '@/components/kb/panels/concepts/concept/ConceptEditingActions'
import ConceptDetail from '@/components/kb/panels/concepts/concept/ConceptDetail'
import ConceptPath from '@/components/kb/panels/concepts/concept/ConceptPath'
import ConceptViewToggle from '@/components/kb/panels/concepts/concept/toggleView/ConceptViewToggle'

import { isReadOnly } from '@/lib/auth/role'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const Concept = () => {
  const { user } = use(UserContext)
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
