import { useState } from 'react'
import { Box } from '@mui/material'

import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'
import NameChangeExtent from '@/components/common/NameChangeExtent'

import { otherApprovalSx } from '@/components/common/format'
import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'
import { pendingInfo } from '@/lib/kb/model/history'
import { isPendingName } from '@/lib/kb/state/name'
import { isAdmin } from '@/lib/auth/role'

import { HISTORY_FIELD, LABELS, PENDING } from '@/lib/constants'

const { APPROVAL } = PENDING
const { NAME_ONLY } = LABELS.CONCEPT.CHANGE_NAME

const PendingNameItem = ({ item, user }) => {
  const [nameChangeType, setNameChangeType] = useState(NAME_ONLY)

  if (!item || item.field !== HISTORY_FIELD.NAME || !isPendingName(item)) return null

  const title = pendingActionValue(item)
  const nameSx = otherApprovalSx(APPROVAL.ACCEPT)
  const isAdminUser = isAdmin(user)
  const enableExtent = true // For now, always enable in history panel context

  const handleNameChangeType = event => {
    setNameChangeType(event.target.value)
  }

  const pendingDetailTitle = (
    <Box>
      <PendingItemTitle sx={nameSx} action={item.action} title={title} />
    </Box>
  )

  const pendingDetailValues = (
    <>
      <PendingValues disabled={false} leftMargin={6} pendingValues={pendingInfo(item)} />
      {isAdminUser && (
        <Box sx={{ ml: 16 }}>
          <NameChangeExtent
            disabled={!enableExtent}
            nameChangeType={nameChangeType}
            onChange={handleNameChangeType}
          />
        </Box>
      )}
    </>
  )

  return (
    <PendingDetail
      pendingDetailTitle={pendingDetailTitle}
      pendingDetailValues={pendingDetailValues}
    />
  )
}

export default PendingNameItem
