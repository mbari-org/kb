import { use } from 'react'

import { Box, Typography } from '@mui/material'

import FieldDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/FieldDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { usePendingRankApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { pendingInfo } from '@/lib/kb/model/history'
import { pendingRank } from '@/lib/kb/state/rank'

import { formatDelta, formatField } from '@/components/common/format'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { RANK } = PENDING.GROUP

const RankDetail = ({ pendingField }) => {
  const { initialState } = use(ConceptContext)

  const approval = usePendingRankApproval()

  const rankField = pendingField('Rank')

  if (!rankField) return null

  const rank = pendingRank(rankField)

  const initialRank = initialState.rank

  const pendingLevel =
    rank.level !== initialRank.level
      ? {
          field: 'RankLevel',
          id: rank.id,
          newValue: rank.level,
          oldValue: initialRank.level,
        }
      : null

  const pendingName =
    rank.name !== initialRank.name
      ? {
          field: 'RankName',
          id: rank.id,
          newValue: rank.name,
          oldValue: initialRank.name,
        }
      : null

  const pendingRanks = []
  if (pendingLevel) pendingRanks.push(pendingLevel)
  if (pendingName) pendingRanks.push(pendingName)
  if (pendingRanks.length === 0) {
    return null
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
