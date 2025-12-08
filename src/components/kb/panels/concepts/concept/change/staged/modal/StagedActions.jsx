import { use, useCallback, useEffect, useMemo, useRef } from 'react'

import Actions from '@/components/modal/actions/Actions'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { isStateModified } from '@/lib/kb/state/state'

import { UNSAFE_ACTION } from '@/lib/kb/constants/unsafeAction.js'
import { RESETTING } from '@/lib/constants.js'
import { UI_TEXT } from '@/config/js/index.js'
import { UI_TEXT as UI_TEXT_OLD } from '@/lib/kb/constants/uiText.js'
import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const COLORS = ['cancel', 'main']
const { BUTTON } = UI_TEXT.PANELS.CONCEPTS
const { DISCARD_ALL, SAVE } = BUTTON.BUTTON
const { BACK_TO_EDIT, CONFIRM_DISCARD, REJECT_DISCARD } = UI_TEXT_OLD.LABELS.BUTTON
const { TO_INITIAL } = CONCEPT_STATE.RESET
const { CONFIRMED } = RESETTING

const getLabels = (confirmReset, intent) => {
  const actionLabels = [DISCARD_ALL, intent === SAVE ? SAVE : BACK_TO_EDIT]
  const confirmLabels = [CONFIRM_DISCARD, REJECT_DISCARD]
  return confirmReset ? confirmLabels : actionLabels
}

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

  const onAction = useCallback(label => {
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
  }, [closeModal, handleSpecialAction, modifyConcept, saveStaged, setUnsafeAction])

  const labels = useMemo(() => getLabels(confirmReset, intent), [confirmReset, intent])

  return <Actions colors={COLORS} labels={labels} onAction={onAction} />
}

export default StagedActions
