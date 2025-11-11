import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'
import PendingGroup from '@/components/kb/panels/concepts/concept/change/pending/PendingGroup'

import usePendingGroupApproval from '@/contexts/panels/concepts/pending/usePendingGroupApproval'

import { pendingInfo } from '@/lib/kb/model/history'
import { pendingChange, pendingRank } from '@/lib/kb/state/rank'

import { formatDelta, formatField, otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants/constants'

const { APPROVAL, GROUP } = PENDING

const RankDetail = ({ pendingConcept }) => {
  const approval = usePendingGroupApproval(GROUP.RANK)

  const rank = pendingRank(pendingConcept)
  if (!rank) return null

  const rankChange = pendingChange(pendingConcept)

  const pendingField = field => {
    return rankChange.new[field] !== rankChange.old[field]
      ? {
          field,
          id: rank.historyId,
          creatorName: rank.creatorName,
          creationTimestamp: rank.creationTimestamp,
          newValue: rankChange.new[field],
          oldValue: rankChange.old[field],
        }
      : null
  }

  const pendingLevel = pendingField('level')
  const pendingName = pendingField('name')

  const pendingRanks = []
  if (pendingLevel) pendingRanks.push(pendingLevel)
  if (pendingName) pendingRanks.push(pendingName)
  if (pendingRanks.length === 0) {
    return null
  }

  const rankSx = otherApprovalSx(approval)

  const pendingGroupTitle = (
    <>
      <PendingButtons approval={approval} group={GROUP.RANK} />
      <Typography sx={rankSx}>Rank</Typography>
    </>
  )

  const pendingGroupDetail = (
    <Box sx={{ ml: 11.5 }}>
      {pendingRanks.map(pendingRank => {
        const fieldName = formatField(pendingRank.field)
        const fieldDelta = formatDelta(pendingRank.oldValue, pendingRank.newValue)
        const disabled = approval === APPROVAL.OTHER

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
            <PendingValues
              leftMargin={2}
              pendingValues={pendingInfo(pendingRank)}
              disabled={disabled}
            />
          </Box>
        )
      })}
    </Box>
  )

  return (
    <PendingGroup pendingGroupTitle={pendingGroupTitle} pendingGroupDetail={pendingGroupDetail} />
  )
}

export default RankDetail
