import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import useUpdatedPending from '@/contexts/panels/concepts/pending/useUpdatePending'

import { pendingChild as getPendingChild } from '@/lib/kb/model/history'

import { isAdmin } from '@/lib/auth/role'

import { LABELS, PENDING } from '@/lib/constants'

const { APPROVE, APPROVE_ALL, CLOSE, CONFIRM, DEFER, REJECT, REJECT_ALL } = LABELS.BUTTON
const { APPROVAL, GROUP } = PENDING

const PendingActions = () => {
  const { concept, pending, setPendingConfirm } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const { user } = use(UserContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  const updatePending = useUpdatedPending()

  const pendingChild = getPendingChild(pendingParent, concept.name)
  const pendingItems = useMemo(() => {
    return pendingChild ? [pendingChild] : pendingConcept
  }, [pendingConcept, pendingChild])

  const [disabled, labels] = useMemo(() => {
    if (!isAdmin(user)) {
      return [
        [true, false, true],
        [APPROVE_ALL, CLOSE, REJECT_ALL],
      ]
    }

    if (!pendingConfirm) {
      return [
        [false, false, false],
        [APPROVE_ALL, DEFER, REJECT_ALL],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.ACCEPT && pendingConfirm.group === GROUP.ALL) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT_ALL],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.REJECT && pendingConfirm.group === GROUP.ALL) {
      return [
        [true, false, false],
        [APPROVE_ALL, DEFER, CONFIRM],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.ACCEPT) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.REJECT) {
      return [
        [true, false, false],
        [APPROVE, DEFER, CONFIRM],
      ]
    }
  }, [pendingConfirm, user])

  const colors = ['clean', 'main', 'cancel']

  const onAction = useCallback(
    label => {
      switch (label) {
        case APPROVE_ALL: {
          setPendingConfirm({ approval: APPROVAL.ACCEPT, group: GROUP.ALL, pendingItems })
          break
        }

        case CONFIRM: {
          updatePending(pendingConfirm).then(() => {
            const morePending = pendingItems.filter(
              history => !pendingConfirm.pendingItems.some(item => item.id === history.id)
            )
            if (morePending.length === 0) {
              closeModal()
            }

            setPendingConfirm(null)
          })
          break
        }

        case DEFER:
          if (!pendingConfirm) {
            closeModal()
          }
          setPendingConfirm(null)
          break

        case REJECT_ALL: {
          setPendingConfirm({ approval: APPROVAL.REJECT, group: GROUP.ALL, pendingItems })
          break
        }

        default:
          setPendingConfirm(null)
          closeModal()
          break
      }
    },
    [closeModal, pendingConfirm, pendingItems, setPendingConfirm, updatePending]
  )

  return createActions({ colors, disabled, labels, onAction }, 'PendingActions')
}

export default PendingActions
