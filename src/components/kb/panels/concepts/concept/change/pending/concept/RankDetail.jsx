import { Box, Typography } from '@mui/material'

import FieldDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/FieldDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { useRankPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { formatDelta, formatField } from '@/components/common/format'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { RANK } = PENDING.GROUP

const RankDetail = ({ pendingField }) => {
  const approval = useRankPendingApproval()

  const pendingRankLevel = pendingField('RankLevel')
  const pendingRankName = pendingField('RankName')
  const pendingRanks = [...pendingRankLevel, ...pendingRankName]

  const numPendingRanks = pendingRanks.length

  if (numPendingRanks === 0) {
    return null
  }

  if (numPendingRanks === 1) {
    const pendingRank = pendingRanks[0]
    return (
      <FieldDetail
        key={pendingRank.id}
        pendingField={pendingRank}
        pendingFieldApproval={() => true}
      />
    )
  }

  const rankSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PendingButtons approval={approval} pending={RANK} />
        <Typography sx={rankSx}>Rank</Typography>
      </Box>
      <Box sx={{ ml: 8 }}>
        {pendingRanks.map(pendingRank => {
          const fieldName = formatField(pendingRank.field)
          const fieldDelta = formatDelta(pendingRank.oldValue, pendingRank.newValue)
          const disabled = approval === OTHER

          return (
            <Box
              key={pendingRank.id}
              sx={{
                alignItems: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                mt: 0.5,
              }}
            >
              <FieldValueDisplay disabled={disabled} field={fieldName} value={fieldDelta} />
              <Box sx={{ ml: 8 }}>
                {pendingInfo(pendingRank)?.map(([field, value]) => (
                  <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
                ))}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default RankDetail
