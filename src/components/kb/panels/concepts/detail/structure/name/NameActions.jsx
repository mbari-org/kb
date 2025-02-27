import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { UPDATE } from '@/contexts/concept/lib/submit/nameUpdates'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

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
  const labels = [CANCEL, UPDATE.NAME_ONLY, UPDATE.ALL_DATA]

  const onAction = label => {
    if (label !== CANCEL) {
      modifyConcept({
        type: CONCEPT_STATE.ALIAS.EDIT,
        update: { nameUpdate: label },
      })
    } else {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { name: concept.name },
      })
    }

    setModal(null)
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default NameActions
