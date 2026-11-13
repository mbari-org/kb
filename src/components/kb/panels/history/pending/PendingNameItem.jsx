import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'
import usePendingNameData from '@/components/kb/panels/concepts/concept/change/pending/usePendingNameData'
import NameChangeExtent from '@/components/common/NameChangeExtent'
import RelatedDataCounts from '@/components/common/concept/RelatedDataCounts'

import { usePanelModalOperationsContext } from '@/contexts/panel/modal'

import { otherApprovalSx } from '@/components/common/format'
import { pendingActionValue } from '@/components/kb/panels/concepts/concept/change/action'
import { pendingFieldLabel, pendingInfo } from '@/lib/model/history'
import { isPendingName } from '@/lib/concept/state/name'

import { PENDING } from '@/lib/constants/pending.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import CONFIG from '@/lib/config'

const { APPROVAL } = PENDING
const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME
const { REALIZATIONS, TEMPLATES_DEFINED } =
  CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME.RELATED_DATA_COUNTS

const PendingNameItem = ({ item, isAdmin }) => {
  const { updateModalData } = usePanelModalOperationsContext()
  const [nameChangeType, setNameChangeType] = useState(REASSIGN)
  const nameData = usePendingNameData(item)

  useEffect(() => {
    updateModalData({ nameChangeType })
  }, [nameChangeType, updateModalData])

  if (!item || item.field !== HISTORY_FIELD.NAME || !isPendingName(item)) return null

  const title = pendingActionValue(item)
  const nameSx = otherApprovalSx(APPROVAL.ACCEPT)

  const handleNameChangeType = event => {
    setNameChangeType(event.target.value)
  }

  const filteredCounts = nameData?.counts.filter(
    count => count.title !== TEMPLATES_DEFINED && count.title !== REALIZATIONS
  )

  const pendingDetailTitle = (
    <Box>
      <PendingItemTitle sx={nameSx} action={`${pendingFieldLabel(item)} ${item.action}`} title={title} />
    </Box>
  )

  const pendingDetailValues = (
    <>
      <PendingValues disabled={false} leftMargin={6} pendingValues={pendingInfo(item)} />
      {isAdmin && nameData?.hasRelatedData && (
        <Box sx={{ ml: 16 }}>
          <NameChangeExtent nameChangeType={nameChangeType} onChange={handleNameChangeType} />
        </Box>
      )}
      <RelatedDataCounts relatedDataCounts={filteredCounts} />
    </>
  )

  return <PendingDetail pendingDetailTitle={pendingDetailTitle} pendingDetailValues={pendingDetailValues} />
}

export default PendingNameItem
