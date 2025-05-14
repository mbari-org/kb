import { use, useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { pendingValues } from '@/components/kb/panels/concept/change/pending/util'

import { capitalize } from '@/lib/util'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { MEDIA } = PENDING.GROUP

const MediaItemDetail = ({ pendingMediaItem }) => {
  const { confirmPending } = use(ConceptContext)

  const pendingAction = capitalize(pendingMediaItem.action.toLowerCase())

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.pending === MEDIA || confirmPending?.pending === pendingMediaItem.id) {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending, pendingMediaItem.id])

  const aliasSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx
  const disabled = approval === OTHER

  const aliasName = useMemo(() => {
    if (pendingMediaItem.action === 'ADD') {
      return pendingMediaItem.newValue
    }
    if (pendingMediaItem.action === 'DELETE') {
      return pendingMediaItem.oldValue
    }
    return ''
  }, [pendingMediaItem])

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
        <PendingButtons approval={approval} pending={pendingMediaItem.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAction}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{aliasName}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingValues(pendingMediaItem)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default MediaItemDetail
