import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { fieldSx, formatDelta } from '@/components/common/format'

import { useItemPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const RealizationDetail = ({ pendingRealization }) => {
  const pendingAction = capitalize(pendingRealization.action.toLowerCase())

  const approval = useItemPendingApproval(pendingRealization.id)

  const realizationSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx
  const disabled = approval === OTHER

  const realizationTitle = useMemo(() => {
    switch (pendingRealization.action) {
      case 'ADD':
        return `${pendingRealization.newValue} (${pendingRealization.toConcept})`

      case 'DELETE':
        return `${pendingRealization.oldValue} (${pendingRealization.toConcept})`

      case 'REPLACE':
        return `${formatDelta(pendingRealization.oldValue, pendingRealization.newValue)} (${
          pendingRealization.toConcept
        })`

      default:
        return ''
    }
  }, [pendingRealization])

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
        <PendingButtons approval={approval} pending={pendingRealization.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={realizationSx}>{pendingAction}:</Typography>
          <Typography sx={{ ...realizationSx, fontWeight: 'bold', ml: 1 }}>
            {realizationTitle}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingRealization)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default RealizationDetail
