import { use } from 'react'

import { createConceptActions } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import saveDelete from '@/contexts/panels/concepts/staged/save/saveDelete'

import { LABELS, SELECTED } from '@/lib/constants'

const { CANCEL, DELETE } = LABELS.CONCEPT.ACTION

const DeleteConceptActions = () => {
  const { concept, setEditing } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { updateSelected } = use(SelectedContext)
  const { deleteConcept } = use(TaxonomyContext)

  const handleCancel = () => {
    closeModal()
  }

  const handleDelete = () => {
    closeModal()
    saveDelete(concept.name, apiFns.apiResult)
      .then(() => deleteConcept(concept.name))
      .then(selectConceptName => {
        updateSelected({ [SELECTED.CONCEPT]: selectConceptName })
        setEditing(false)
      })
  }

  // Custom action configuration for delete confirmation
  return createConceptActions({
    onDiscard: handleCancel,  // Cancel button
    onStage: handleDelete,    // Delete button 
    stageDisabled: !modalData?.isValid,
    confirmReset: false,
    name: 'DeleteConceptActions'
  })
}

export default DeleteConceptActions
