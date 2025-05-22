import { use, useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { pendingInfo } from '@/lib/kb/model/history'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const ParentDetail = ({ pendingField }) => {
  const { confirmPending } = use(ConceptContext)

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.pending === 'Concept.parent') {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending])

  const pendingParent = pendingField('Concept.parent')?.pop()
  if (!pendingParent) {
    return null
  }

  const parentValue = `${pendingParent.oldValue} --> ${pendingParent.newValue}`

  const aliasSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx
  const disabled = approval === OTHER

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
        <PendingButtons approval={approval} pending={pendingParent.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>Parent:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{parentValue}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingInfo(pendingParent)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default ParentDetail
