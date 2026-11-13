import { useState } from 'react'
import { Box, Stack } from '@mui/material'

import { usePanelModalDataContext, usePanelModalOperationsContext } from '@/contexts/panel/modal'

import Actions from '@/components/common/factory/Actions'
import PendingAlert from '@/components/modal/actions/PendingAlert'

import { PENDING } from '@/lib/constants/pending.js'
import { createError } from '@/lib/errors'
import useHistoryUpdatePending from '@/contexts/panels/history/useHistoryUpdatePending'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { APPROVE, CLOSE, CONFIRM, REJECT } = CONFIG.BUTTON

const HistoryPendingActions = props => {
  const { modalData } = usePanelModalDataContext()
  const { beginProcessing, closeModal } = usePanelModalOperationsContext()

  const updatePending = useHistoryUpdatePending()

  const { item, nameChangeType } = { ...modalData, ...props }

  const [pendingConfirm, setPendingConfirm] = useState(null)

  const colors = ['clean', 'main', 'cancel']

  const [disabled, labels] = (() => {
    switch (pendingConfirm) {
      case PENDING.APPROVAL.ACCEPT:
        return [
          [false, false, true],
          [CONFIRM, CLOSE, REJECT],
        ]

      case PENDING.APPROVAL.REJECT:
        return [
          [true, false, false],
          [APPROVE, CLOSE, CONFIRM],
        ]

      default:
        return [
          [false, false, false],
          [APPROVE, CLOSE, REJECT],
        ]
    }
  })()

  const onAction = async label => {
    switch (label) {
      case APPROVE: {
        setPendingConfirm(PENDING.APPROVAL.ACCEPT)
        break
      }

      case CLOSE: {
        if (pendingConfirm) {
          setPendingConfirm(null)
        } else {
          closeModal()
        }
        break
      }

      case CONFIRM: {
        try {
          const stop = beginProcessing(PROCESSING.UPDATE, PROCESSING.ARG.PENDING)
          await updatePending({ approval: pendingConfirm, item, nameChangeType }).finally(stop)
        } finally {
          closeModal(true)
        }
        break
      }

      case REJECT: {
        setPendingConfirm(PENDING.APPROVAL.REJECT)
        break
      }

      default:
        throw createError('Invalid Action', `Cannot handle unknown pending item action: ${label}`, {
          label,
          pendingConfirm,
        })
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
