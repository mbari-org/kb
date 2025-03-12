import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { INTENT } from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import submitUpdates from '@/contexts/concept/lib/submit/submitUpdates'

const CONFIRM_DISCARD = 'Confirm Discard'
const CONTINUE = 'Continue'
const DISCARD = 'Discard All'
const SAVE = 'Save'

const SAVING = 'Saving...'

const StagedStateActions = ({ intent }) => {
  const { config } = use(ConfigContext)
  const { concept, confirmReset, initialState, modifyConcept, setEditing, stagedState } =
    use(ConceptContext)
  const { closeModal, setProcessing } = use(ModalContext)
  const { selectConcept, selectPanel } = use(SelectedContext)
  const { loadConcept } = use(TaxonomyContext)

  const colors = ['cancel', 'main']
  const actionLabels = [DISCARD, intent === INTENT.SAVE ? SAVE : CONTINUE]
  const confirmLabels = [CONFIRM_DISCARD, CONTINUE]

  const labels = confirmReset ? confirmLabels : actionLabels

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.YES })
        break

      case CONTINUE:
        selectConcept(concept.name)
        selectPanel('Concepts')
        modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
        closeModal()
        break

      case DISCARD:
        modifyConcept({ type: CONCEPT_STATE.RESET.TO_INITIAL })
        break

      case SAVE:
        closeModal()
        setProcessing(SAVING)
        submitUpdates(config, concept, initialState, stagedState).then(results => {
          console.log('Results:', results)
          loadConcept(concept.name, true).then(() => {
            setEditing(false)
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
