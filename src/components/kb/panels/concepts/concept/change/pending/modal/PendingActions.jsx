import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptUpdatedPending from '@/contexts/panels/concepts/pending/useConceptUpdatePending'

import { isAdmin } from '@/lib/auth/role'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/text'

const { APPROVE, APPROVE_ALL, CLOSE, CONFIRM, DEFER, REJECT, REJECT_ALL } = CONFIG.PANELS.CONCEPTS.MODALS.BUTTON
const { APPROVAL } = PENDING
const GROUP = CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT

const PendingActions = () => {
  const { pending, setPendingConfirm } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const { user } = use(UserContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  const updatePending = useConceptUpdatedPending()

  const pendingIds = useMemo(() => {
    if (pendingConfirm?.pendingIds?.length > 0) {
      return pendingConfirm.pendingIds
    }
    return pendingConcept.map(({ id }) => id)
  }, [pendingConcept, pendingConfirm])

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
          setPendingConfirm({ approval: APPROVAL.ACCEPT, group: GROUP.ALL, pendingIds })
          break
        }

        case CONFIRM: {
          updatePending(pendingConfirm).then(isMorePending => {
            if (!isMorePending) {
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
          setPendingConfirm({ approval: APPROVAL.REJECT, group: GROUP.ALL, pendingIds })
          break
        }

        default:
          setPendingConfirm(null)
          closeModal()
          break
      }
    },
    [closeModal, pendingConfirm, pendingIds, setPendingConfirm, updatePending]
  )

  return createActions({ colors, disabled, labels, onAction }, 'PendingActions')
}

export default PendingActions
