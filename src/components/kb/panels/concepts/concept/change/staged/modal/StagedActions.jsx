import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { CONCEPT_STATE } from '@/lib/constants'
import { LABELS } from '@/lib/constants'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const { BACK_TO_EDIT, CONFIRM_DISCARD, DISCARD_ALL, REJECT_DISCARD } = LABELS.BUTTON
const { SAVE } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

// Note: StagedActions uses createActions directly due to its unique dual-mode behavior
// that doesn't fit the standard concept action patterns
const StagedActions = ({ intent }) => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { logout } = use(UserContext)

  const saveStaged = useSaveStaged()

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
      logout()
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
        closeModal()
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
