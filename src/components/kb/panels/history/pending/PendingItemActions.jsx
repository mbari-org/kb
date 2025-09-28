import { useState } from 'react'
import { Box, Stack } from '@mui/material'

import {
  usePanelModalDataContext,
  usePanelModalOperationsContext,
} from '@/contexts/panel/modal/Context'

import Actions from '@/components/common/factory/Actions'
import PendingAlert from '@/components/modal/actions/PendingAlert'

import { LABELS, PENDING } from '@/lib/constants'
import { createError } from '@/lib/errors'
import useHistoryUpdatePending from '@/contexts/panels/history/useUpdatePending'

const { APPROVE, CONFIRM, DEFER, REJECT } = LABELS.BUTTON

const HistoryPendingActions = props => {
  const { modalData } = usePanelModalDataContext()
  const { closeModal, setProcessing } = usePanelModalOperationsContext()

  const updatePending = useHistoryUpdatePending()

  const { item } = { ...modalData, ...props }

  const [pendingConfirm, setPendingConfirm] = useState(null)

  const colors = ['clean', 'main', 'cancel']

  const [disabled, labels] = (() => {
    switch (pendingConfirm) {
      case PENDING.APPROVAL.ACCEPT:
        return [
          [false, false, true],
          [CONFIRM, DEFER, REJECT],
        ]

      case PENDING.APPROVAL.REJECT:
        return [
          [true, false, false],
          [APPROVE, DEFER, CONFIRM],
        ]

      default:
        return [
          [false, false, false],
          [APPROVE, DEFER, REJECT],
        ]
    }
  })()

  const onAction = async label => {
    switch (label) {
      case APPROVE: {
        setPendingConfirm(PENDING.APPROVAL.ACCEPT)
        return
      }

      case CONFIRM: {
        try {
          setProcessing('Updating pending...')
          await updatePending({ approval: pendingConfirm, item })
        } finally {
          setProcessing(false)
          closeModal(true)
        }
        return
      }

      case DEFER: {
        if (pendingConfirm) {
          setPendingConfirm(null)
        } else {
          closeModal()
        }
        return
      }

      case REJECT: {
        setPendingConfirm(PENDING.APPROVAL.REJECT)
        return
      }

      default:
        throw createError(
          'Invalid Action',
          `Cannot handle unknown pending item action: ${label}`,
          { label, pendingConfirm }
        )
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
