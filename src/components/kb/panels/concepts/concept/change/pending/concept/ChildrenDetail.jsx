import { Box, Stack, Typography } from '@mui/material'

import ChildDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import { useChildrenPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { CHILDREN } = PENDING.GROUP

const ChildrenDetail = ({ leftMargin, pendingField }) => {
  const pendingChildren = pendingField('Concept.child').sort((a, b) => {
    const aValue = a.newValue ?? a.oldValue
    const bValue = b.newValue ?? b.oldValue
    return aValue.localeCompare(bValue)
  })

  const approval = useChildrenPendingApproval()

  const mediaSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  if (pendingChildren.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PendingButtons approval={approval} pending={CHILDREN} />
        <Typography sx={mediaSx}>Children</Typography>
      </Box>
      <Stack direction='column' spacing={1}>
        {pendingChildren.map(pendingChild => (
          <ChildDetail key={pendingChild.id} pendingChild={pendingChild} leftMargin={leftMargin} />
        ))}
      </Stack>
    </Box>
  )
}

export default ChildrenDetail
