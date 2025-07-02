import { use } from 'react'
import { createActions } from '@/components/modal/panelModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_STATE } from '@/lib/constants'
import { LABELS } from '@/lib/constants'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const { BACK_TO_EDIT, CONFIRM_DISCARD, DISCARD_ALL, REJECT_DISCARD } = LABELS.BUTTON
const { SAVE } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const StagedActions = ({ intent }) => {
  const { concept, confirmReset, modifyConcept } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)

  const saveStaged = useSaveStaged()

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD_ALL, intent === SAVE ? SAVE : BACK_TO_EDIT]
  const confirmLabels = [CONFIRM_DISCARD, REJECT_DISCARD]

  const labels = confirmReset ? confirmLabels : actionLabels

  const onAction = label => {
    switch (label) {
      case BACK_TO_EDIT:
        updateSelected({ concept: concept.name, panel: 'Concepts' })
        modifyConcept({ type: CONFIRMED.NO })
        closeModal()
        break

      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        break

      case REJECT_DISCARD:
        modifyConcept({ type: CONFIRMED.NO })
        break

      case DISCARD_ALL:
        modifyConcept({ type: TO_INITIAL })
        break

      case SAVE:
        saveStaged()
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, labels, onAction }, 'StagedStateActions')
}

export default StagedActions
