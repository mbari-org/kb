import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS, PENDING } from '@/lib/constants'

import useUpdatePending from '@/contexts/concept/pending/useUpdatePending'

const { APPROVE, APPROVE_ALL, CONFIRM, DEFER, REJECT, REJECT_ALL } = LABELS.BUTTON
const { APPROVAL, GROUP } = PENDING

const PendingActions = () => {
  const { confirmPending, setConfirmPending } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const updatePending = useUpdatePending()

  const [disabled, labels] = useMemo(() => {
    if (!confirmPending) {
      return [
        [false, false, false],
        [APPROVE_ALL, DEFER, REJECT_ALL],
      ]
    }
    if (confirmPending.approval === APPROVAL.ACCEPT && confirmPending.change === GROUP.ALL) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT_ALL],
      ]
    }
    if (confirmPending.approval === APPROVAL.REJECT && confirmPending.change === GROUP.ALL) {
      return [
        [true, false, false],
        [APPROVE_ALL, DEFER, CONFIRM],
      ]
    }

    if (confirmPending.approval === APPROVAL.ACCEPT) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT],
      ]
    }

    if (confirmPending.approval === APPROVAL.REJECT) {
      return [
        [true, false, false],
        [APPROVE, DEFER, CONFIRM],
      ]
    }
  }, [confirmPending])

  const colors = ['clean', 'main', 'cancel']

  const onAction = useCallback(
    label => {
      switch (label) {
        case APPROVE_ALL:
          setConfirmPending({ approval: APPROVAL.ACCEPT, change: GROUP.ALL })
          break

        case CONFIRM:
          updatePending()
          break

        case DEFER:
          if (!confirmPending) {
            closeModal()
          }
          setConfirmPending(null)
          break

        case REJECT_ALL:
          setConfirmPending({ approval: APPROVAL.REJECT, change: GROUP.ALL })
          break

        default:
          setConfirmPending(null)
          closeModal()
          break
      }
    },
    [confirmPending, closeModal, setConfirmPending, updatePending]
  )

  return createActions({ colors, disabled, labels, onAction }, 'PendingActions')
}

export default PendingActions
