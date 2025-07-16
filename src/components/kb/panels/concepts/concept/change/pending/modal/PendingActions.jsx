import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'
import useUpdatedPending from '@/contexts/panels/concepts/pending/useUpdatePending'

import { pendingChild as getPendingChild } from '@/lib/kb/model/history'

import { isAdmin } from '@/lib/auth/role'

import { LABELS, PENDING } from '@/lib/constants'

const { APPROVE, APPROVE_ALL, CLOSE, CONFIRM, DEFER, REJECT, REJECT_ALL } = LABELS.BUTTON
const { APPROVAL, GROUP } = PENDING

const PendingActions = () => {
  const { concept, confirmPending, setConfirmPending } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const { user } = use(UserContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const updatePending = useUpdatedPending()

  const pendingChild = getPendingChild(parentPending, concept.name)
  const pendingItems = useMemo(() => {
    return pendingChild ? [pendingChild] : conceptPending
  }, [conceptPending, pendingChild])

  const [disabled, labels] = useMemo(() => {
    if (!isAdmin(user)) {
      return [
        [true, false, true],
        [APPROVE_ALL, CLOSE, REJECT_ALL],
      ]
    }

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
  }, [confirmPending, user])

  const colors = ['clean', 'main', 'cancel']

  const onAction = useCallback(
    label => {
      switch (label) {
        case APPROVE_ALL: {
          setConfirmPending({ approval: APPROVAL.ACCEPT, change: GROUP.ALL, pendingItems })
          break
        }

        case CONFIRM: {
          updatePending(confirmPending).then(() => {
            const morePending = pendingItems.filter(
              history => !confirmPending.pendingItems.some(item => item.id === history.id)
            )
            if (morePending.length === 0) {
              closeModal()
            }

            setConfirmPending(null)
          })
          break
        }

        case DEFER:
          if (!confirmPending) {
            closeModal()
          }
          setConfirmPending(null)
          break

        case REJECT_ALL: {
          setConfirmPending({ approval: APPROVAL.REJECT, change: GROUP.ALL, pendingItems })
          break
        }

        default:
          setConfirmPending(null)
          closeModal()
          break
      }
    },
    [closeModal, confirmPending, pendingItems, setConfirmPending, updatePending]
  )

  return createActions({ colors, disabled, labels, onAction }, 'PendingActions')
}

export default PendingActions
