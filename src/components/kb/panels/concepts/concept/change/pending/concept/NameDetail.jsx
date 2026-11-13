import { use, useEffect } from 'react'

import { Box } from '@mui/material'

import NameChangeExtent from '@/components/common/NameChangeExtent'
import RelatedDataCounts from '@/components/common/concept/RelatedDataCounts'
import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import PendingDetail from '@/components/kb/panels/concepts/concept/change/pending/PendingDetail'
import PendingItemTitle from '@/components/kb/panels/concepts/concept/change/pending/PendingItemTitle'
import PendingValues from '@/components/kb/panels/concepts/concept/change/pending/PendingValues'
import usePendingNameData from '@/components/kb/panels/concepts/concept/change/pending/usePendingNameData'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import UserContext from '@/contexts/user/UserContext'

import { formatDelta, otherApprovalSx } from '@/components/common/format'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { pendingFieldLabel, pendingInfo } from '@/lib/model/history'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const { APPROVAL } = PENDING
const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME
const { REALIZATIONS, TEMPLATES_DEFINED } =
  CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME.RELATED_DATA_COUNTS

const NameDetail = ({ pendingName }) => {
  const { setModalData } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)
  const { isAdmin } = use(UserContext)

  const approval = usePendingItemApproval(pendingName)
  const nameData = usePendingNameData(pendingName)

  useEffect(() => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: REASSIGN,
    }))
  }, [setModalData])

  const nameSx = otherApprovalSx(approval)
  const disabled = approval === APPROVAL.OTHER

  const nameChangeType = modalData?.nameChangeType

  const handleNameChangeType = event => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: event.target.value,
    }))
  }

  const filteredCounts = nameData?.counts.filter(
    count => count.title !== TEMPLATES_DEFINED && count.title !== REALIZATIONS
  )

  const pendingDetailTitle = (
    <>
      <PendingButtons approval={approval} item={pendingName} />
      <PendingItemTitle
        sx={nameSx}
        action={`${pendingFieldLabel(pendingName)} ${pendingName.action}`}
        title={formatDelta(pendingName.oldValue, pendingName.newValue)}
      />
    </>
  )

  const pendingDetailValues = (
    <>
      <PendingValues disabled={disabled} pendingValues={pendingInfo(pendingName)} />
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

export default NameDetail
