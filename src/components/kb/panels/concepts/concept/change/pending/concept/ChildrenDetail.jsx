import { Box, Stack, Typography } from '@mui/material'

import ChildDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildDetail'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'

import { usePendingChildrenApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { otherApprovalSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { GROUP } = PENDING

const ChildrenDetail = ({ leftMargin, pendingField }) => {
  const pendingChildren = pendingField('Concept.child').sort((a, b) => {
    const aValue = a.newValue ?? a.oldValue
    const bValue = b.newValue ?? b.oldValue
    return aValue.localeCompare(bValue)
  })

  const approval = usePendingChildrenApproval()

  const childrenSx = otherApprovalSx(approval)

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
        <PendingButtons approval={approval} group={GROUP.CHILDREN} />
        <Typography sx={childrenSx}>Children</Typography>
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
