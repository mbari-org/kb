import { use } from 'react'
import { createActions } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import saveDelete from '@/contexts/concept/staged/save/saveDelete'

import { LABELS } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.CONCEPT.ACTION

const DeleteConceptActions = () => {
  const { concept, setEditing } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { closeModal, modalData } = use(ModalContext)
  const { selectConcept } = use(SelectedContext)
  const { deleteConcept } = use(TaxonomyContext)

  const colors = ['cancel', 'main']
  const labels = [DELETE, CANCEL]
  const disabled = [!modalData?.isValid, false]

  const onAction = label => {
    closeModal()

    if (label === DELETE) {
      saveDelete(concept.name, apiFns.apiResult)
        .then(() => deleteConcept(concept.name))
        .then(selectConceptName => {
          selectConcept(selectConceptName)
          setEditing(false)
        })
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'ConceptNameUpdateActions')
}

export default DeleteConceptActions
