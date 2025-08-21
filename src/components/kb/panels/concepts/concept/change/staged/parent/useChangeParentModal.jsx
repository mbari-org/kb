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

const { LOADING } = PROCESSING
const { RESET } = CONCEPT_STATE

const initialModalData = {
  action: CONCEPT_STATE.PARENT,
  modified: false,
  parent: '',
}

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
    if (modalData.modified) {
      modifyConcept({
        type: RESET.PARENT,
        update: {
          name: modalData.name,
        },
      })
      return false
    }
    return true
  }
}

const useChangeParentModal = () => {
  const { concept, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData, setProcessing } = use(ConceptModalContext)
  const { getDescendantNames } = use(TaxonomyContext)

  const alreadyLoadingDescendants = useRef(false)

  return useCallback(async () => {
    if (!concept || alreadyLoadingDescendants.current) return

    try {
      alreadyLoadingDescendants.current = true
      setProcessing(LOADING)

      const descendantNames = await getDescendantNames(concept.name)
      const omitChoices = [concept.name, concept.parent, ...descendantNames]

      const modal = changeParentModal(omitChoices)
      const onClose = changeParentOnClose(modifyConcept)

      setModal(modal, onClose)
      setModalData(initialModalData)
    } catch (error) {
      throw new Error(`Failed to load descendants: ${error}`)
    } finally {
      alreadyLoadingDescendants.current = false
      setProcessing(false)
    }
  }, [concept, getDescendantNames, modifyConcept, setModal, setModalData, setProcessing])
}

export default useChangeParentModal
