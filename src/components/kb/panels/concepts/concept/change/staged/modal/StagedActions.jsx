import { use, useCallback, useEffect, useMemo, useRef } from 'react'

import Actions from '@/components/modal/actions/Actions'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import { isStateModified } from '@/lib/concept/state/state'

import { GUARDED_ACTION } from '@/lib/constants/guardedAction.js'
import { RESETTING } from '@/lib/constants'
import CONFIG from '@/text'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const COLORS = ['cancel', 'main']
const { BUTTON } = CONFIG.PANELS.CONCEPTS
const { DISCARD_ALL, SAVE } = BUTTON
const {
  CONTINUE: BACK_TO_EDIT,
  CONFIRM_DISCARD,
  DECLINE_DISCARD: REJECT_DISCARD,
} = CONFIG.PANELS.CONCEPTS.MODALS.BUTTON
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
  const { updateSelected, updateSettings } = use(SelectedContext)
  const { logout, setGuardedAction } = use(UserContext)

  const saveStaged = useSaveStaged()
  const resetConfirmedRef = useRef(false)

  const handleSpecialAction = useCallback(() => {
    const { panel: selectPanel, concept: selectConcept, guardedAction, logout: isLogout } = modalData || {}

    if (guardedAction) {
      switch (guardedAction.type) {
        case GUARDED_ACTION.CHANGE_CONCEPT:
          updateSelected({ concept: guardedAction.payload.concept, force: true })
          break

        case GUARDED_ACTION.CHANGE_PANEL:
          updateSelected({ panel: guardedAction.payload.panel })
          if (guardedAction.payload.settings) {
            updateSettings(guardedAction.payload.settings)
          }
          break

        case GUARDED_ACTION.LOGOUT:
          closeModal(true, () => logout())
          break

        case GUARDED_ACTION.REFRESH:
          closeModal(true, async () => await refresh())
          break
      }
      setGuardedAction(null)
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
  }, [closeModal, logout, modalData, refresh, setGuardedAction, updateSelected, updateSettings])

  useEffect(() => {
    if (resetConfirmedRef.current && !isStateModified({ initialState, stagedState })) {
      handleSpecialAction()
      closeModal()
      setEditing(false)
      resetConfirmedRef.current = false
    }
  }, [closeModal, handleSpecialAction, initialState, setEditing, stagedState])

  const onAction = useCallback(async label => {
    switch (label) {
      case BACK_TO_EDIT:
        setGuardedAction(null)
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
        await saveStaged()
        handleSpecialAction()
        break

      default:
        closeModal()
        break
    }
  }, [closeModal, handleSpecialAction, modifyConcept, saveStaged, setGuardedAction])

  const labels = useMemo(() => getLabels(confirmReset, intent), [confirmReset, intent])

  return <Actions colors={COLORS} labels={labels} onAction={onAction} />
}

export default StagedActions
