import { Box, Typography } from '@mui/material'

import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { formatDelta, formatField } from '@/components/common/format'
import { pendingActionText, pendingInfo } from '@/lib/kb/model/history'

import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const PendingRankItem = ({ item }) => {
  if (!item || item.field !== HISTORY_FIELD.RANK) return null

  const fieldName = formatField(item.field)
  const fieldDelta = formatDelta(item.oldValue, item.newValue)

  const pendingDetailTitle = (
    <Typography sx={{ fontWeight: 'bold' }}>{pendingActionText(item.action)}</Typography>
  )

  const pendingDetailValues = (
    <Box sx={{ ml: 6 }}>
      <Box sx={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', mt: 0.5 }}>
        <FieldValueDisplay disabled={false} field={fieldName} value={fieldDelta} />
        <PendingValues leftMargin={2} pendingValues={pendingInfo(item)} disabled={false} />
      </Box>
    </Box>
  )

  return (
    <PendingDetail
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default PendingRankItem
