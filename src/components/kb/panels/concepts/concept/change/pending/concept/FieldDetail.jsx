import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import { useFieldPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { formatDelta, formatField } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

// CxNote: pendingFieldApproval allows custom approval for fields beyond the field id

const FieldDetail = ({ pendingField, pendingFieldApproval = () => false }) => {
  const approval = useFieldPendingApproval(pendingField.id)

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
      <Box sx={{ ml: 8 }}>
        {pendingInfo(pendingField)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default FieldDetail
