import { useState } from 'react'
import { Box, Stack } from '@mui/material'

import { usePanelModalDataContext, usePanelModalOperationsContext } from '@/contexts/panel/modal'

import Actions from '@/components/common/factory/Actions'
import PendingAlert from '@/components/modal/actions/PendingAlert'
import ActionsAlert from '@/components/modal/actions/ActionsAlert'

import { PENDING } from '@/lib/constants/pending.js'
import { createError } from '@/lib/errors'
import useHistoryUpdatePending from '@/contexts/panels/history/useHistoryUpdatePending'
import { isRenameRejectBlocked, renameRejectLines } from '@/lib/concept/pending/renameRejectBlocked'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { APPROVE, CLOSE, CONFIRM, REJECT } = CONFIG.BUTTON

const HistoryPendingActions = props => {
  const { modalData } = usePanelModalDataContext()
  const { beginProcessing, closeModal } = usePanelModalOperationsContext()

  const updatePending = useHistoryUpdatePending()

  const { item, nameChangeType } = { ...modalData, ...props }

  const [pendingConfirm, setPendingConfirm] = useState(null)
  const [notice, setNotice] = useState(null)

  const colors = notice ? ['main'] : ['approve', 'main', 'reject']

  const [hidden, labels] = (() => {
    if (notice) {
      return [[false], [CLOSE]]
    }

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
        const stop = beginProcessing(PROCESSING.UPDATE, PROCESSING.ARG.PENDING)
        setNotice(null)
        const processed = await updatePending({ approval: pendingConfirm, item, nameChangeType })
          .catch(error => {
            if (!isRenameRejectBlocked(error)) throw error
            setNotice(renameRejectLines(error))
            setPendingConfirm(null)
            return false
          })
          .finally(stop)
        if (processed !== false) {
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
        {!!notice && <ActionsAlert lines={notice} severity='warning' />}
      </Stack>
      <Actions colors={colors} hidden={hidden} labels={labels} onAction={onAction} />
    </Box>
  )
}

export default HistoryPendingActions
