import { useMemo } from 'react'

import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'

import { otherApprovalSx } from '@/components/common/format'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { ACTION } from '@/lib/constants'
import { PENDING } from '@/lib/constants/pending.js'

const { APPROVAL, GROUP } = PENDING

const ChildDetail = ({ pendingChild }) => {
  const approval = usePendingItemApproval(pendingChild)

  const aliasSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const childName = useMemo(() => {
    if (pendingChild.action === ACTION.ADD) {
      return pendingChild.newValue
    }
    if (pendingChild.action === ACTION.DELETE) {
      return pendingChild.oldValue
    }
    return ''
  }, [pendingChild])

  const childInfo = useMemo(() => {
    const info = []
    if (pendingChild.parent) {
      info.push(['parent', pendingChild.parent])
    }
    info.push(...pendingInfo(pendingChild))
    return info
  }, [pendingChild])

  const pendingDetailTitle = (
    <>
      <PendingButtons approval={approval} group={GROUP.CHILDREN} item={pendingChild} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={aliasSx}>{pendingChild.action}</Typography>
        {childName !== pendingChild.concept && (
          <Typography sx={{ ...aliasSx, fontWeight: 'bold' }}>: {childName}</Typography>
        )}
      </Box>
    </>
  )

  const pendingDetailValues = <PendingValues pendingValues={childInfo} disabled={disabled} />

  return (
    <PendingDetail
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default ChildDetail
