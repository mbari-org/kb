import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { ASSOCIATED_DATA, NAME_ONLY } = LABELS.CONCEPT.CHANGE_NAME
const { DISCARD } = LABELS.ACTION

const ChangeNameActions = () => {
  const { concept, stagedState, modifyConcept } = use(ConceptContext)
  const { closeModal } = use(ModalContext)
  const { taxonomyNames } = use(TaxonomyContext)

  const colors = ['cancel', 'main', 'main']
  const disabled =
    concept.name !== stagedState.name && !taxonomyNames.includes(stagedState.name)
      ? [false, false, false]
      : [false, true, true]
  const labels = [DISCARD, NAME_ONLY, ASSOCIATED_DATA]

  const onAction = label => {
    if (label !== DISCARD) {
      modifyConcept({
        type: CONCEPT_STATE.STRUCTURE.CHANGE_NAME,
        update: { field: 'nameChange', value: label },
      })
    } else {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { field: 'name', value: concept.name },
      })
    }

    closeModal()
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default ChangeNameActions
