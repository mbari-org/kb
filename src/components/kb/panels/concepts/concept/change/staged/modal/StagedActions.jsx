import { use, useEffect, useRef } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { CONCEPT_STATE } from '@/lib/constants'
import { LABELS } from '@/lib/constants'
import { hasModifiedState } from '@/lib/kb/state/concept'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const { BACK_TO_EDIT, CONFIRM_DISCARD, DISCARD_ALL, REJECT_DISCARD } = LABELS.BUTTON
const { SAVE } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const StagedActions = ({ intent }) => {
  const { confirmReset, initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { logout } = use(UserContext)

  const saveStaged = useSaveStaged()
  const resetConfirmedRef = useRef(false)

  // Monitor state changes after reset confirmation to close modal if no modifications remain
  useEffect(() => {
    if (resetConfirmedRef.current && !hasModifiedState({ initialState, stagedState })) {
      closeModal()
      resetConfirmedRef.current = false
    }
  }, [initialState, stagedState, closeModal])

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD_ALL, intent === SAVE ? SAVE : BACK_TO_EDIT]
  const confirmLabels = [CONFIRM_DISCARD, REJECT_DISCARD]

  const labels = confirmReset ? confirmLabels : actionLabels

  const handleProceedWithAction = () => {
    const { panel, concept: targetConcept, logout: isLogout } = modalData || {}

    if (panel) {
      updateSelected({ panel })
    } else if (targetConcept) {
      updateSelected({ concept: targetConcept })
    } else if (isLogout) {
      // Close modal and wait for React to complete cleanup before logging out
      closeModal(true, () => {
        logout()
      })
    }
  }

  const onAction = label => {
    switch (label) {
      case BACK_TO_EDIT:
        modifyConcept({ type: CONFIRMED.NO })
        closeModal()
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        handleProceedWithAction()
        resetConfirmedRef.current = true
        break

      case REJECT_DISCARD:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case DISCARD_ALL:
        modifyConcept({ type: TO_INITIAL })
        break

      case SAVE:
        saveStaged()
        handleProceedWithAction()
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, labels, onAction }, 'StagedStateActions')
}

export default StagedActions
