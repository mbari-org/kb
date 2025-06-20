import { use } from 'react'
import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_STATE } from '@/lib/constants'
import { LABELS, SELECTED } from '@/lib/constants'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

const { BACK_TO_EDIT, CANCEL, CONTINUE, SAVE } = LABELS.BUTTON
const { CONFIRMED } = CONCEPT_STATE.RESET

const StagedActions = () => {
  const { concept, modifyConcept } = use(ConceptContext)
  const { closeModal, modalData, setProcessing } = use(ModalContext)
  const { select } = use(SelectedContext)

  const saveStaged = useSaveStaged()

  const colors = ['cancel', 'main']
  const labels = [SAVE, CANCEL]
  const disabled = [!modalData?.isValid, false]

  const onAction = label => {
    closeModal()

    switch (label) {
      case SAVE:
        setProcessing('Saving...')
        saveStaged()
        break
      case BACK_TO_EDIT:
        select({ [SELECTED.CONCEPT]: concept.name, [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS })
        modifyConcept({ type: CONFIRMED.NO })
        closeModal()
        break
      case CONTINUE:
        select({ [SELECTED.CONCEPT]: concept.name, [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS })
        modifyConcept({ type: CONFIRMED.YES })
        closeModal()
        break
    }
  }

  return createActions({ colors, labels, onAction }, 'StagedStateActions')
}

export default StagedActions
