import { useState } from 'react'
import { Box } from '@mui/material'

import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'
import NameChangeExtent from '@/components/common/NameChangeExtent'

import { otherApprovalSx } from '@/components/common/format'
import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'
import { pendingInfo } from '@/lib/model/history'
import { isPendingName } from '@/lib/concept/state/name'

import { PENDING } from '@/lib/constants/pending.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import CONFIG from '@/lib/config'

const { APPROVAL } = PENDING
const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const PendingNameItem = ({ item, isAdmin }) => {
  const [nameChangeType, setNameChangeType] = useState(REASSIGN)

  if (!item || item.field !== HISTORY_FIELD.NAME || !isPendingName(item)) return null

  const title = pendingActionValue(item)
  const nameSx = otherApprovalSx(APPROVAL.ACCEPT)

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
      {isAdmin && (
        <Box sx={{ ml: 16 }}>
          <NameChangeExtent nameChangeType={nameChangeType} onChange={handleNameChangeType} />
        </Box>
      )}
    </>
  )

  return <PendingDetail pendingDetailTitle={pendingDetailTitle} pendingDetailValues={pendingDetailValues} />
}

export default PendingNameItem
