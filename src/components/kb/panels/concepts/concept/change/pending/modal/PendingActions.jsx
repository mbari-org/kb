import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptUpdatedPending from '@/contexts/panels/concepts/pending/useConceptUpdatePending'
import { isRenameRejectBlocked, renameRejectLines } from '@/lib/concept/pending/renameRejectBlocked'

import { pendingChild as getPendingChild } from '@/lib/model/history'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const { APPROVE, APPROVE_ALL, CLOSE, CONFIRM, REJECT, REJECT_ALL } = CONFIG.BUTTON
const { APPROVAL } = PENDING
const GROUP = CONFIG.PANELS.CONCEPTS.MODALS.CONCEPT

const PendingActions = () => {
  const { concept, pending, setPendingConfirm } = use(ConceptContext)
  const { closeModal, setModalData } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)

  const { isAdmin } = use(UserContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)
  const closeOnly = modalData.closeOnly

  const updatePending = useConceptUpdatedPending()

  const pendingIds = useMemo(() => {
    if (pendingConfirm?.pendingIds?.length > 0) {
      return pendingConfirm.pendingIds
    }
    const ids = pendingConcept.map(({ id }) => id)
    const pendingChild = getPendingChild(pendingParent, concept.name)
    return pendingChild && !ids.includes(pendingChild.id) ? [...ids, pendingChild.id] : ids
  }, [concept.name, pendingConcept, pendingConfirm, pendingParent])

  const [colors, disabled, labels] = useMemo(() => {
    const actionColors = ['approve', 'main', 'reject']

    if (!isAdmin || closeOnly) {
      return [['main'], [false], [CLOSE]]
    }

    if (!pendingConfirm) {
      return [actionColors, [false, false, false], [APPROVE_ALL, CLOSE, REJECT_ALL]]
    }

    if (pendingConfirm.approval === APPROVAL.ACCEPT && pendingConfirm.group === GROUP.ALL) {
      return [actionColors, [false, false, true], [CONFIRM, CLOSE, REJECT_ALL]]
    }

    if (pendingConfirm.approval === APPROVAL.REJECT && pendingConfirm.group === GROUP.ALL) {
      return [actionColors, [true, false, false], [APPROVE_ALL, CLOSE, CONFIRM]]
    }

    if (pendingConfirm.approval === APPROVAL.ACCEPT) {
      return [actionColors, [false, false, true], [CONFIRM, CLOSE, REJECT]]
    }

    if (pendingConfirm.approval === APPROVAL.REJECT) {
      return [actionColors, [true, false, false], [APPROVE, CLOSE, CONFIRM]]
    }
  }, [closeOnly, isAdmin, pendingConfirm])

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
          setModalData(prev => ({ ...prev, alert: null }))
          const isMorePending = await updatePending({
            ...pendingConfirm,
            nameChangeType: modalData?.nameChangeType,
          }).catch(error => {
            if (!isRenameRejectBlocked(error)) throw error
            setModalData(prev => ({
              ...prev,
              alert: { lines: renameRejectLines(error), severity: 'warning' },
              closeOnly: true,
            }))
          })
          if (isMorePending === false) {
            closeModal(true)
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
    [closeModal, modalData, pendingConfirm, pendingIds, setModalData, setPendingConfirm, updatePending]
  )

  return createActions({ colors, disabled, labels, onAction }, 'PendingActions')
}

export default PendingActions
