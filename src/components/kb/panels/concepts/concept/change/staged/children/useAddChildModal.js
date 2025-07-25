import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'

import AddChildActions from './AddChildActions'
import AddChildContent from './AddChildContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { ADD_CHILD, RESET } = CONCEPT_STATE

const addChildModal = () => {
  const components = {
    Actions: AddChildActions,
    Content: AddChildContent,
    Title: ConceptTitle,
  }

  return createModal(components)
}

const addChildOnClose = modifyConcept => {
  return modalData => {
    // Handle case where modalData is null (defensive programming)
    if (!modalData) {
      return true
    }

    if (modalData.modified) {
      modifyConcept({
        type: RESET.CHILD,
        update: {
          child: modalData.child,
        },
      })
      return false
    }
    return true
  }
}

const initialModalData = {
  action: ADD_CHILD,
  child: {
    author: '',
    name: '',
    rankLevel: '',
    rankName: '',
  },
  modified: false,
}

const useAddChildModal = () => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = addChildModal()
    const onClose = addChildOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [modifyConcept, setModal, setModalData])
}

export default useAddChildModal
