import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { fieldPendingHistory } from '@/lib/kb/model/pendingHistory'
import { sendPendingAction } from '@/lib/kb/api/history'

import { APPROVE, DEFER, REJECT } from '@/lib/constants'
const PendingFieldActions = ({ field }) => {
  const { pendingHistory } = use(ConceptContext)
  const { config } = use(ConfigContext)
  const { closeModal } = use(ModalContext)

  const pendingFieldHistory = fieldPendingHistory(pendingHistory, field)

  const colors = ['cancel', 'main', 'clean']
  const labels = [REJECT, DEFER, APPROVE]

  const onAction = label => {
    switch (label) {
      case REJECT:
        sendPendingAction(config, 'reject', pendingFieldHistory.id)
        break
      case DEFER:
        break
      case APPROVE:
        sendPendingAction(config, 'approve', pendingFieldHistory.id)
        break
      default:
        break
    }
    closeModal()
  }

  return createActions({ colors, labels, onAction }, 'PendingFieldActions')
}

export default PendingFieldActions
