import { useMemo } from 'react'

import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { fieldSx } from '@/components/common/format'

import { usePendingItemApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'
import { capitalize } from '@/lib/utils'

const { OTHER } = PENDING.APPROVAL

const ChildDetail = ({ pendingChild, leftMargin }) => {
  const pendingAction = capitalize(pendingChild.action.toLowerCase())

  const approval = usePendingItemApproval(pendingChild.id)

  const aliasSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx
  const disabled = approval === OTHER

  const childName = useMemo(() => {
    if (pendingChild.action === 'ADD') {
      return pendingChild.newValue
    }
    if (pendingChild.action === 'DELETE') {
      return pendingChild.oldValue
    }
    return ''
  }, [pendingChild])

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', ml: leftMargin.title }}>
        <PendingButtons approval={approval} pending={pendingChild.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAction}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{childName}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: leftMargin.detail }}>
        {pendingInfo(pendingChild)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default ChildDetail
