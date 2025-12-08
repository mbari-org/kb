import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { useFieldPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/model/history'

import { formatDelta, formatField } from '@/components/common/format'

import { PENDING } from '@/lib/constants/pending.js'

const { OTHER } = PENDING.APPROVAL

// CxNote: pendingFieldApproval allows custom approval for fields beyond the field id

const FieldDetail = ({ pendingField, pendingFieldApproval = () => false }) => {
  const individualApproval = useFieldPendingApproval(pendingField.id)

  // If pendingFieldApproval returns true for this field, use the individual approval
  // Otherwise, this field is not part of the custom approval group
  const approval = pendingFieldApproval(pendingField.id) ? individualApproval : OTHER

  const disabled = approval === OTHER

  const fieldName = formatField(pendingField.field)
  const fieldDelta = formatDelta(pendingField.oldValue, pendingField.newValue)

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <PendingButtons approval={approval} pending={pendingField.id} />
        <FieldValueDisplay disabled={disabled} field={fieldName} value={fieldDelta} />
      </Box>
      <PendingValues pendingValues={pendingInfo(pendingField)} disabled={disabled} />
    </Box>
  )
}

export default FieldDetail
