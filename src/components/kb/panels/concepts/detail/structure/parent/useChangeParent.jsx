import { use, useCallback, useRef } from 'react'
import ChangeParentActions from './ChangeParentActions'
import ChangeParentContent from './ChangeParentContent'
import ChangeParentTitle from './ChangeParentTitle'

import { createModal } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { LOADING } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'
import { descendants } from '@/lib/kb/model/taxonomy'

const { RESET } = CONCEPT_STATE
const { CHANGE_PARENT } = CONCEPT_STATE.STRUCTURE

const changeParentModal = omitChoices => {
  const components = {
    Actions: ChangeParentActions,
    Content: () => <ChangeParentContent omitChoices={omitChoices} />,
    Title: ChangeParentTitle,
  }
  return createModal(components)
}

const changeParentOnClose = modifyConcept => {
  return modalData => {
    if (modalData.modified) {
      modifyConcept({
        type: RESET.CHANGE_PARENT,
        update: {
          name: modalData.name,
        },
      })
      return false
    }
    return true
  }
}

const initialModalData = {
  action: CHANGE_PARENT,
  modified: false,
  parent: '',
}

const useChangeParent = closeChoices => {
  const { concept, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData, setProcessing } = use(ModalContext)
  const { loadConceptDescendants } = use(TaxonomyContext)
  const alreadyLoadingDescendants = useRef(false)

  return useCallback(async () => {
    if (!concept || alreadyLoadingDescendants.current) return

    try {
      alreadyLoadingDescendants.current = true
      setProcessing(LOADING)
      closeChoices()

      const taxonomy = await loadConceptDescendants(concept)
      const omitChoices = [
        concept.name,
        concept.parent,
        ...descendants(taxonomy, concept.name).map(descendant => descendant.name),
      ]

      const modal = changeParentModal(omitChoices)
      const onClose = changeParentOnClose(modifyConcept)
      setModal(modal, onClose)

      setModalData(initialModalData)
    } catch (error) {
      console.error('Failed to load descendants:', error)
    } finally {
      alreadyLoadingDescendants.current = false
      setProcessing(null)
    }
  }, [
    closeChoices,
    concept,
    loadConceptDescendants,
    modifyConcept,
    setModal,
    setModalData,
    setProcessing,
  ])
}

export default useChangeParent
