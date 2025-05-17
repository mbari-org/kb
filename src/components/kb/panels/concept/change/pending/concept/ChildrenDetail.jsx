import { use, useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import ChildDetail from '@/components/kb/panels/concept/change/pending/concept/ChildDetail'
import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldSx } from '@/components/common/format'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { CHILDREN } = PENDING.GROUP

const ChildrenDetail = ({ pending }) => {
  const pendingChildren = pending('Concept.child')

  const { confirmPending } = use(ConceptContext)

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.pending === CHILDREN) {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending])

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
          <ChildDetail key={pendingChild.id} pendingChild={pendingChild} />
        ))}
      </Stack>
    </Box>
  )
}

export default ChildrenDetail
