import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { fieldSx } from '@/components/common/format'

import { useItemPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { ALIASES } = PENDING.GROUP

const AliasDetail = ({ pendingAlias }) => {
  const pendingAction = capitalize(pendingAlias.action.toLowerCase())

  const approval = useItemPendingApproval(pendingAlias.id)

  const aliasSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx
  const disabled = approval === OTHER

  const aliasTitle = useMemo(() => {
    switch (pendingAlias.action) {
      case 'ADD':
        return pendingAlias.newValue

      case 'DELETE':
        return pendingAlias.oldValue

      case 'REPLACE':
        return `${pendingAlias.oldValue} --> ${pendingAlias.newValue}`

      default:
        return ''
    }
  }, [pendingAlias])

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
        <PendingButtons approval={approval} pending={pendingAlias.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAction}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{aliasTitle}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingAlias)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default AliasDetail
