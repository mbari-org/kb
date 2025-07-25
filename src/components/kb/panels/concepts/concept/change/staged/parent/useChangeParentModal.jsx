import { use, useCallback, useRef } from 'react'

import ChangeParentActions from './ChangeParentActions'
import ChangeParentContent from './ChangeParentContent'
import ConceptTitle from '@/components/common/ConceptTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PROCESSING } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants'
import { descendants } from '@/lib/kb/model/taxonomy'

const { LOADING } = PROCESSING
const { PARENT, RESET } = CONCEPT_STATE

const changeParentModal = omitChoices => {
  const components = {
    Actions: ChangeParentActions,
    Content: () => <ChangeParentContent omitChoices={omitChoices} />,
    Title: ConceptTitle,
  }
  return createModal(components)
}

const changeParentOnClose = modifyConcept => {
  return modalData => {
    if (!modalData) {
      return true
    }

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
  action: PARENT,
  modified: false,
  parent: '',
}

const useChangeParentModal = () => {
  const { concept, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData, setProcessing } = use(ConceptModalContext)
  const { loadConceptDescendants } = use(TaxonomyContext)
  const alreadyLoadingDescendants = useRef(false)

  return useCallback(async () => {
    if (!concept || alreadyLoadingDescendants.current) return

    try {
      alreadyLoadingDescendants.current = true
      setProcessing(LOADING)

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
      setProcessing(false)
    }
  }, [concept, loadConceptDescendants, modifyConcept, setModal, setModalData, setProcessing])
}

export default useChangeParentModal
