import { use, useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { capitalize } from '@/lib/util'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { ALIASES } = PENDING.GROUP

const AliasDetail = ({ pendingAlias }) => {
  const { confirmPending } = use(ConceptContext)

  const pendingAction = capitalize(pendingAlias.action.toLowerCase())

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.group === ALIASES || confirmPending?.pendingItemId === pendingAlias.id) {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending, pendingAlias.id])

  const aliasSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', ml: 3.4 }}>
        <PendingButtons approval={approval} pendingItemId={pendingAlias.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAction}:</Typography>
          {/* <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{aliasName}</Typography> */}
        </Box>
      </Box>
      {/* <AliasDetail action={action} initial={initial} changing={resetting} updates={updates} /> */}
    </Box>
  )
}

export default AliasDetail
