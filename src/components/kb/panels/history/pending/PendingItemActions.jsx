import { use, useState } from 'react'
import { Box, Stack } from '@mui/material'

import {
  usePanelsModalDataContext,
  usePanelsModalOperationsContext,
} from '@/contexts/panels/PanelModalProvider'

import Actions from '@/components/common/factory/Actions'
import PendingAlert from '@/components/modal/actions/PendingAlert'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { updatePendingItem } from '@/lib/api/history'
import { LABELS, PENDING } from '@/lib/constants'

const { APPROVE, CONFIRM, DEFER, REJECT } = LABELS.BUTTON

const HistoryPendingActions = props => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)
  const { setDirtyConcept } = use(SelectedContext)
  const { modalData } = usePanelsModalDataContext()
  const { closeModal, setProcessing } = usePanelsModalOperationsContext()

  const { item } = { ...modalData, ...props }

  const [pendingConfirm, setPendingConfirm] = useState(null)

  const colors = ['clean', 'main', 'cancel']

  const [disabled, labels] = (() => {
    if (!pendingConfirm) {
      return [
        [false, false, false],
        [APPROVE, DEFER, REJECT],
      ]
    }

    if (pendingConfirm === PENDING.APPROVAL.ACCEPT) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT],
      ]
    }

    if (pendingConfirm === PENDING.APPROVAL.REJECT) {
      return [
        [true, false, false],
        [APPROVE, DEFER, CONFIRM],
      ]
    }

    return [
      [false, false, false],
      [APPROVE, DEFER, REJECT],
    ]
  })()

  const onAction = async label => {
    const isApprove = label === APPROVE
    const isReject = label === REJECT
    const isConfirm = label === CONFIRM
    const isDefer = label === DEFER

    if (isDefer) {
      if (pendingConfirm) {
        setPendingConfirm(null)
      } else {
        closeModal()
      }
      return
    }

    if (isConfirm) {
      try {
        setProcessing('Updating pending...')
        await apiFns.apiPayload(updatePendingItem, [pendingConfirm, item.id])
        await refreshData('pendingHistory')
        setDirtyConcept(true)
      } finally {
        setProcessing(false)
        closeModal(true)
      }
      return
    }

    if (isApprove) {
      setPendingConfirm(PENDING.APPROVAL.ACCEPT)
      return
    }

    if (isReject) {
      setPendingConfirm(PENDING.APPROVAL.REJECT)
      return
    }
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Stack spacing={0} sx={{ alignItems: 'center', mt: 1, height: 60, justifyContent: 'center' }}>
        {!!pendingConfirm && <PendingAlert approval={pendingConfirm} />}
      </Stack>
      <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    </Box>
  )
}

export default HistoryPendingActions
