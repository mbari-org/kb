import { use, useCallback, useEffect, useRef } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { isStateModified } from '@/lib/kb/state'

import { CONCEPT_STATE, LABELS, RESETTING, UNSAFE_ACTION } from '@/lib/constants'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const { BACK_TO_EDIT, CONFIRM_DISCARD, DISCARD_ALL, REJECT_DISCARD } = LABELS.BUTTON
const { SAVE } = LABELS.CONCEPT.ACTION
const { TO_INITIAL } = CONCEPT_STATE.RESET
const { CONFIRMED } = RESETTING

const StagedActions = ({ intent }) => {
  const { confirmReset, initialState, modifyConcept, setEditing, stagedState } =
    use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { refresh } = use(RefreshContext)
  const { updateSelected } = use(SelectedContext)
  const { logout, setUnsafeAction } = use(UserContext)

  const saveStaged = useSaveStaged()
  const resetConfirmedRef = useRef(false)

  const handleSpecialAction = useCallback(() => {
    const { panel: selectPanel, concept: selectConcept, logout: isLogout, unsafeAction } = modalData || {}

    if (unsafeAction) {
      switch (unsafeAction.type) {
        case UNSAFE_ACTION.CONCEPT:
          updateSelected({ concept: unsafeAction.payload.concept, force: true })
          break

        case UNSAFE_ACTION.PANEL:
          updateSelected({ panel: unsafeAction.payload.panel })
          break

        case UNSAFE_ACTION.LOGOUT:
          closeModal(true, () => logout())
          break

        case UNSAFE_ACTION.REFRESH:
          closeModal(true, async () => await refresh())
          break
      }
      setUnsafeAction(null)
      return
    }

    // Legacy flow (to be migrated in Phase 3)
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
  }, [closeModal, logout, modalData, refresh, setUnsafeAction, updateSelected])

  useEffect(() => {
    if (resetConfirmedRef.current && !isStateModified({ initialState, stagedState })) {
      handleSpecialAction()
      closeModal()
      setEditing(false)
      resetConfirmedRef.current = false
    }
  }, [closeModal, handleSpecialAction, initialState, setEditing, stagedState])

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD_ALL, intent === SAVE ? SAVE : BACK_TO_EDIT]
  const confirmLabels = [CONFIRM_DISCARD, REJECT_DISCARD]

  const labels = confirmReset ? confirmLabels : actionLabels

  const onAction = label => {
    switch (label) {
      case BACK_TO_EDIT:
        setUnsafeAction(null)
        modifyConcept({ type: CONFIRMED.NO })
        closeModal()
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
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
