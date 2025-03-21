import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

import submitUpdates from '@/contexts/concept/lib/submit/submitUpdates'

const { CONFIRM_DISCARD, CONTINUE, DISCARD } = LABELS.ACTION
const { SAVE } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const SAVING = 'Saving...'

const StagedStateActions = ({ intent }) => {
  const { config } = use(ConfigContext)
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
        submitUpdates(config, concept, initialState, stagedState).then(results => {
          console.log('Results:', results)
          refreshConcept(concept.name).then(refreshedConcept => {
            console.log('Refreshed Concept:', refreshedConcept)
            console.log('Concept:', concept)
            setEditing(false)
            setProcessing(null)
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
