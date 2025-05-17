import { use, useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { pendingValues } from '@/components/kb/panels/concept/change/pending/util'

import { PENDING } from '@/lib/constants'
import { capitalize } from '@/lib/util'

const { OTHER } = PENDING.APPROVAL
const { CHILDREN } = PENDING.GROUP

const ChildDetail = ({ pendingChild }) => {
  const { confirmPending } = use(ConceptContext)

  const pendingAction = capitalize(pendingChild.action.toLowerCase())

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.pending === CHILDREN || confirmPending?.pending === pendingChild.id) {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending, pendingChild.id])

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
      <Box sx={{ alignItems: 'center', display: 'flex', ml: 3.4 }}>
        <PendingButtons approval={approval} pending={pendingChild.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAction}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{childName}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 11.5 }}>
        {pendingValues(pendingChild)?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default ChildDetail
