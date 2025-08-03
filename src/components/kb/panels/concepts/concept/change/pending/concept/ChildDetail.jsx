import { use, useMemo } from 'react'

import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { otherApprovalSx } from '@/components/common/format'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingInfo } from '@/lib/kb/model/history'

import { ACTION, PENDING } from '@/lib/constants'

const { APPROVAL, GROUP } = PENDING

const ChildDetail = ({ pendingChild, leftMargin }) => {
  const { concept } = use(ConceptContext)

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

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', ml: leftMargin.title }}>
        <PendingButtons approval={approval} group={GROUP.CHILDREN} item={pendingChild} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingChild.action}</Typography>
          {childName !== concept.name && (
            <Typography sx={{ ...aliasSx, fontWeight: 'bold' }}>: {childName}</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ ml: leftMargin.detail }}>
        {childInfo.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default ChildDetail
