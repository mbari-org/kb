import { use, useEffect, useRef } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { isStateModified } from '@/lib/kb/state'

import { CONCEPT_STATE, LABELS, RESETTING } from '@/lib/constants'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const { BACK_TO_EDIT, CONFIRM_DISCARD, DISCARD_ALL, REJECT_DISCARD } = LABELS.BUTTON
const { SAVE } = LABELS.CONCEPT.ACTION
const { TO_INITIAL } = CONCEPT_STATE.RESET
const { CONFIRMED } = RESETTING

const StagedActions = ({ intent }) => {
  const { concept, confirmReset, initialState, modifyConcept, setEditing, stagedState } =
    use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { logout } = use(UserContext)

  const saveStaged = useSaveStaged()
  const resetConfirmedRef = useRef(false)

  // Monitor state changes after reset confirmation to close modal if no modifications remain
  useEffect(() => {
    if (resetConfirmedRef.current && !isStateModified({ initialState, stagedState })) {
      closeModal()
      setEditing(false)
      resetConfirmedRef.current = false
    }
  }, [closeModal, initialState, setEditing, stagedState])

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD_ALL, intent === SAVE ? SAVE : BACK_TO_EDIT]
  const confirmLabels = [CONFIRM_DISCARD, REJECT_DISCARD]

  const labels = confirmReset ? confirmLabels : actionLabels

  // special triggers that require further action
  const handleSpecialAction = () => {
    const { panel: selectPanel, concept: selectConcept, logout: isLogout } = modalData || {}

    if (selectPanel) {
      updateSelected({ panel: selectPanel })
      return
    }

    if (selectConcept) {
      updateSelected({ concept: selectConcept })
      return
    }

    if (isLogout) {
      closeModal(true, () => logout())
    }
  }

  const onAction = label => {
    switch (label) {
      case BACK_TO_EDIT:
        updateSelected({ concept: concept.name })
        modifyConcept({ type: CONFIRMED.NO })
        closeModal()
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        handleSpecialAction()
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
        handleSpecialAction()
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, labels, onAction }, 'StagedStateActions')
}

export default StagedActions
