import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptUpdatedPending from '@/contexts/panels/concepts/pending/useConceptUpdatePending'

import { pendingChild as getPendingChild } from '@/lib/model/history'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const { APPROVE, APPROVE_ALL, CLOSE, CONFIRM, REJECT, REJECT_ALL } = CONFIG.BUTTON
const { APPROVAL } = PENDING
const GROUP = CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT

const PendingActions = () => {
  const { concept, pending, setPendingConfirm } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const { isAdmin } = use(UserContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  const updatePending = useConceptUpdatedPending()

  const pendingIds = useMemo(() => {
    if (pendingConfirm?.pendingIds?.length > 0) {
      return pendingConfirm.pendingIds
    }
    const ids = pendingConcept.map(({ id }) => id)
    const pendingChild = getPendingChild(pendingParent, concept.name)
    return pendingChild && !ids.includes(pendingChild.id) ? [...ids, pendingChild.id] : ids
  }, [concept.name, pendingConcept, pendingConfirm, pendingParent])

  const [disabled, labels] = useMemo(() => {
    if (!isAdmin) {
      return [
        [true, false, true],
        [APPROVE_ALL, CLOSE, REJECT_ALL],
      ]
    }

    if (!pendingConfirm) {
      return [
        [false, false, false],
        [APPROVE_ALL, CLOSE, REJECT_ALL],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.ACCEPT && pendingConfirm.group === GROUP.ALL) {
      return [
        [false, false, true],
        [CONFIRM, CLOSE, REJECT_ALL],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.REJECT && pendingConfirm.group === GROUP.ALL) {
      return [
        [true, false, false],
        [APPROVE_ALL, CLOSE, CONFIRM],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.ACCEPT) {
      return [
        [false, false, true],
        [CONFIRM, CLOSE, REJECT],
      ]
    }

    if (pendingConfirm.approval === APPROVAL.REJECT) {
      return [
        [true, false, false],
        [APPROVE, CLOSE, CONFIRM],
      ]
    }
  }, [isAdmin, pendingConfirm])

  const colors = ['clean', 'main', 'cancel']

  const onAction = useCallback(
    async label => {
      switch (label) {
        case APPROVE_ALL: {
          setPendingConfirm({ approval: APPROVAL.ACCEPT, group: GROUP.ALL, pendingIds })
          break
        }

        case CLOSE:
          if (!pendingConfirm) {
            closeModal()
          }
          setPendingConfirm(null)
          break

        case CONFIRM: {
          const isMorePending = await updatePending(pendingConfirm)
          if (!isMorePending) {
            closeModal()
          }
          setPendingConfirm(null)
          break
        }

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
