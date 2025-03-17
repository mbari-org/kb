import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import { NAME_UPDATE } from '@/lib/kb/concept/state/structure'

const ChangeNameActions = () => {
  const { concept, stagedState, modifyConcept } = use(ConceptContext)
  const { closeModal } = use(ModalContext)
  const { taxonomyNames } = use(TaxonomyContext)

  const colors = ['cancel', 'main', 'main']
  const disabled =
    concept.name !== stagedState.name && !taxonomyNames.includes(stagedState.name)
      ? [false, false, false]
      : [false, true, true]
  const labels = [NAME_UPDATE.CANCEL, NAME_UPDATE.NAME_ONLY, NAME_UPDATE.ALL_DATA]

  const onAction = label => {
    if (label !== NAME_UPDATE.CANCEL) {
      modifyConcept({
        type: CONCEPT_STATE.STRUCTURE.NAME_CHANGE,
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
