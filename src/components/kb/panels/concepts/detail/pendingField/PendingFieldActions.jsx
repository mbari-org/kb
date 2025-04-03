import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { getFieldPendingHistory } from '@/lib/kb/util/pendingHistory'
import { sendPendingAction } from '@/lib/services/api/oni/history'

const APPROVE = 'Approve'
const DEFER = 'Defer'
const REJECT = 'Reject'

const PendingFieldActions = ({ field }) => {
  const { pendingHistory } = use(ConceptContext)
  const { config } = use(ConfigContext)
  const { closeModal } = use(ModalContext)

  const pendingFieldHistory = getFieldPendingHistory(pendingHistory, field)

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
