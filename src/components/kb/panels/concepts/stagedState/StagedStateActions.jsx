import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

import { LABELS } from '@/lib/constants'

import submitUpdates from '@/contexts/concept/lib/submit/submitUpdates'

const { CONFIRM_DISCARD, CONTINUE, DISCARD } = LABELS.ACTION
const { SAVE } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const SAVING = 'Saving...'

const StagedStateActions = ({ intent }) => {
  const { apiFns } = use(ConfigContext)
  const { concept, confirmReset, initialState, modifyConcept, setEditing, stagedState } =
    use(ConceptContext)
  const { closeModal, setProcessing } = use(ModalContext)
  const { selectConcept, selectPanel } = use(SelectedContext)
  const { refreshConcept } = use(TaxonomyContext)

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD, intent === SAVE ? SAVE : CONTINUE]
  const confirmLabels = [CONFIRM_DISCARD, CONTINUE]

  const labels = confirmReset ? confirmLabels : actionLabels

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONFIRMED.YES })
        break

      case CONTINUE:
        selectConcept(concept.name)
        selectPanel('Concepts')
        modifyConcept({ type: CONFIRMED.NO })
        closeModal()
        break

      case DISCARD:
        modifyConcept({ type: TO_INITIAL })
        break

      case SAVE:
        closeModal()
        setProcessing(SAVING)
        submitUpdates(apiFns.apiPayload, concept, initialState, stagedState).then(updateInfo => {
          refreshConcept(concept, updateInfo).then(updatedConcept => {
            const { hasUpdated } = updateInfo

            setEditing(false)
            setProcessing(null)
            if (hasUpdated('name')) {
              selectConcept(updatedConcept.name)
            }
          })
        })
        break

      default:
        closeModal()
        break
    }
  }

  return createActions({ colors, labels, onAction }, 'StagedStateActions')
}

export default StagedStateActions
