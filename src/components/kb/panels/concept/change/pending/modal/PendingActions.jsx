import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { APPROVE, APPROVE_ALL, DEFER, DEFER_ALL, REJECT, REJECT_ALL } = LABELS.BUTTON

const PendingActions = () => {
  const { confirmPending, setConfirmPending } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const actionLabels = useMemo(() => [APPROVE_ALL, REJECT_ALL], [])
  const confirmLabels = useMemo(() => [APPROVE, DEFER], [])
  const rejectLabels = useMemo(() => [DEFER, REJECT], [])

  const confirmApprove = useMemo(
    () => confirmPending && confirmPending.action === APPROVE,
    [confirmPending]
  )
  const confirmReject = useMemo(
    () => confirmPending && confirmPending.action === REJECT,
    [confirmPending]
  )

  const colors = confirmApprove
    ? ['clean', 'main']
    : confirmReject
    ? ['main', 'cancel']
    : ['clean', 'cancel']

  const labels = confirmApprove ? confirmLabels : confirmReject ? rejectLabels : actionLabels

  const onAction = useCallback(
    label => {
      switch (label) {
        case APPROVE:
          setConfirmPending(null)
          closeModal()
          break

        case APPROVE_ALL:
          setConfirmPending({ action: APPROVE, change: 'all' })
          break

        case DEFER:
          setConfirmPending(null)
          break

        case DEFER_ALL:
          setConfirmPending(null)
          closeModal()
          break

        case REJECT:
          setConfirmPending(null)
          closeModal()
          break

        case REJECT_ALL:
          setConfirmPending({ action: REJECT, change: 'all' })
          break

        default:
          setConfirmPending(null)
          closeModal()
          break
      }
    },
    [closeModal, setConfirmPending]
  )

  return createActions({ colors, labels, onAction }, 'PendingActions')
}

export default PendingActions
