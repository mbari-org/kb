import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'
import { NAME_UPDATE } from '@/lib/kb/concept/state/structure'

const CANCEL = 'Cancel'

const NameActions = () => {
  const { concept, editingState, modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)
  const { getNames } = use(TaxonomyContext)

  const taxonomyNames = getNames()

  const colors = ['cancel', 'main', 'main']
  const disabled =
    concept.name !== editingState.name && !taxonomyNames.includes(editingState.name)
      ? [false, false, false]
      : [false, true, true]
  const labels = [CANCEL, NAME_UPDATE.NAME_ONLY, NAME_UPDATE.ALL_DATA]

  const onAction = label => {
    if (label !== CANCEL) {
      modifyConcept({
        type: CONCEPT_STATE.STRUCTURE.NAME_CHANGE,
        update: { field: 'nameUpdate', value: label },
      })
    } else {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { field: 'name', value: concept.name },
      })
    }

    setModal(null)
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default NameActions
